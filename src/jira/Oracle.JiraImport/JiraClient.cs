using Microsoft.Extensions.Configuration;
using Model;
using Model.Jira;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace JiraImport
{
    public class JiraClient
    {

        private static readonly string URL = "https://{0}/jira/rest/api/latest";

        private readonly string _host;
        private readonly string _username;
        private readonly string _password;

        public JiraClient(IConfigurationRoot configuration)
        {
            _host = configuration.GetSection("Environment").Value;
            _username = configuration.GetSection("User").GetSection("Username").Value;
            _password = configuration.GetSection("User").GetSection("Password").Value;

            CheckStatus().Wait();
        }

        private HttpClient CreateClient()
        {
            HttpClient client = new HttpClient();

            client.Timeout = TimeSpan.FromSeconds(120);
            client.DefaultRequestHeaders.Accept.Clear();

            string encodedCredentials = Convert.ToBase64String(Encoding.UTF8.GetBytes(string.Format("{0}:{1}", _username, _password)));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", encodedCredentials);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            return client;
        }

        private async Task CheckStatus()
        {
            HttpClient client = CreateClient();
            string url = string.Format("https://{0}/jira/status", _host);
            Console.Write("[Checking Environment Status]: ");
            var stringTask = await client.GetStringAsync(url);
            JObject o = JObject.Parse(stringTask);
            Console.WriteLine(o["state"]);
        }

        public async Task<Issue> GetIssueAsync(string id)
        {
            HttpClient client = CreateClient();
            string GET_ISSUE = string.Format(URL, _host) + "/issue/{0}";

            string restCall = string.Format(GET_ISSUE, "FRCE-78363");
            Console.WriteLine("[GET]\t" + restCall);

            var stringTask = await client.GetStringAsync(restCall);
            return JsonConvert.DeserializeObject<Issue>(stringTask);
        }

        public class BulkCreate
        {
            public List<BulkIssue> IssueUpdates { get; set; } = new List<BulkIssue>();
        }
        public class BulkIssue
        {
            public CreateMetaFields Fields { get; set; }
        }
        public class BulkResult
        {
            public List<BaseJiraItem> Issues { get; set; }
            public List<string> Errors { get; set; }
        }

        public async Task<List<BaseJiraItem>> CreateIssuesAsync(List<CreateMetaFields> metaFields)
        {
            HttpClient client = CreateClient();
            string CREATE_ISSUE = string.Format(URL, _host) + "/issue/bulk";
            BulkCreate meta = new BulkCreate();
            foreach(var metaField in metaFields)
            {
                meta.IssueUpdates.Add(new BulkIssue
                {
                    Fields = metaField
                });
            };

            string str = JsonConvert.SerializeObject(meta, Formatting.None, new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new LowercaseContractResolver()
            });

            var content = new StringContent(str);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            Console.WriteLine("[POST]\t" + CREATE_ISSUE);
            var response = await client.PostAsync(CREATE_ISSUE, content);
            response.EnsureSuccessStatusCode();
            BulkResult result = JsonConvert.DeserializeObject<BulkResult>(await response.Content.ReadAsStringAsync());
            return result.Issues;
        }

        public async Task<BaseJiraItem> CreateIssueAsync(CreateMetaFields meta)
        {
            HttpClient client = CreateClient();
            string CREATE_ISSUE = string.Format(URL, _host) + "/issue";

            string str = JsonConvert.SerializeObject(meta, Formatting.None, new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new LowercaseContractResolver()
            });

            var content = new StringContent(str);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            Console.WriteLine("[POST]\t" + CREATE_ISSUE);
            var response = await client.PostAsync(CREATE_ISSUE, content);
            response.EnsureSuccessStatusCode();
            return JsonConvert.DeserializeObject<BaseJiraItem>(await response.Content.ReadAsStringAsync());
        }
    }

    public class LowercaseContractResolver : DefaultContractResolver
    {
        protected override string ResolvePropertyName(string propertyName)
        {
            if (propertyName == "IssueUpdates")
                return "issueUpdates";
            return propertyName.ToLower();
        }
    }
}
