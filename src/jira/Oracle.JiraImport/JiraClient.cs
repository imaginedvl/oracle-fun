﻿using Microsoft.Extensions.Configuration;
using Model.Jira;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

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
            Console.WriteLine("[Using Environment]: {0}", _host);
            _username = configuration.GetSection("User").GetSection("Username").Value;
            _password = configuration.GetSection("User").GetSection("Password").Value;

            CheckStatus().Wait();
        }

        private HttpClient CreateClient()
        {
            HttpClient client = new()
            {
                Timeout = TimeSpan.FromSeconds(120)
            };
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
            JsonNode o = JsonNode.Parse(stringTask);
            Console.WriteLine(o!["state"]);
        }

        public async Task<Issue> GetIssueAsync(string id)
        {
            HttpClient client = CreateClient();
            string GET_ISSUE = string.Format(URL, _host) + "/issue/{0}";

            string restCall = string.Format(GET_ISSUE, id);
            Console.WriteLine("[GET]\t" + restCall);

            var stringTask = await client.GetStringAsync(restCall);
            return JsonSerializer.Deserialize<Issue>(stringTask, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        public async Task<List<Issue>> SearchIssuesAsync(string jql, string[] fields)
        {
            HttpClient client = CreateClient();
            string SEARCH_ISSUE = string.Format(URL, _host) + "/search?jql={0}&fields={1}";

            string restCall = string.Format(SEARCH_ISSUE, HttpUtility.UrlEncode(jql), string.Join(",", fields));
            Console.WriteLine("[GET]\t" + restCall);

            var stringTask = await client.GetStringAsync(restCall);

            SearchResults results = JsonSerializer.Deserialize<SearchResults>(stringTask, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            if (results.Total <= results.MaxResults)
            {
                Console.WriteLine("Find {0} results", results.Total);
            }
            else
            {
                Console.WriteLine("Getting {0} first results out of {1} (maximum reached)", results.MaxResults, results.Total);
            }

            return results.Issues;
        }
        public class SearchResults
        {
            public int StartAt { get; set; }
            public int MaxResults { get; set; }
            public int Total { get; set; }
            public List<Issue> Issues { get; set; }
        }

        public async Task<List<BaseJiraItem>> CreateIssuesAsync(List<CreateMetaFields> metaFields)
        {
            HttpClient client = CreateClient();
            string CREATE_ISSUE = string.Format(URL, _host) + "/issue/bulk";
            BulkCreate meta = new();
            foreach(var metaField in metaFields)
            {
                meta.IssueUpdates.Add(new BulkIssue
                {
                    Fields = metaField
                });
            };

            var options = new JsonSerializerOptions
            {
                WriteIndented = false,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
            string str = JsonSerializer.Serialize(meta, options);

            // backing up request body...
            Guid id = Guid.NewGuid();
            File.WriteAllText(id + ".json", str);

            var content = new StringContent(str);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            Console.WriteLine("[POST]\t" + CREATE_ISSUE + " using request body in " + id.ToString() + ".json");
            var response = await client.PostAsync(CREATE_ISSUE, content);
            response.EnsureSuccessStatusCode();
            BulkResult result = JsonSerializer.Deserialize<BulkResult>(await response.Content.ReadAsStringAsync());
            return result.Issues;
        }

        public async Task<BaseJiraItem> CreateIssueAsync(CreateMetaFields meta)
        {
            HttpClient client = CreateClient();
            string CREATE_ISSUE = string.Format(URL, _host) + "/issue";

            var options = new JsonSerializerOptions
            {
                WriteIndented = false,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
            string str = JsonSerializer.Serialize(meta, options);

            var content = new StringContent(str);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            Console.WriteLine("[POST]\t" + CREATE_ISSUE);
            var response = await client.PostAsync(CREATE_ISSUE, content);
            response.EnsureSuccessStatusCode();
            return JsonSerializer.Deserialize<BaseJiraItem>(await response.Content.ReadAsStringAsync());
        }

        private class BulkCreate
        {
            [JsonPropertyName("issueUpdates")]
            public List<BulkIssue> IssueUpdates { get; set; } = new List<BulkIssue>();
        }

        private class BulkIssue
        {
            [JsonPropertyName("fields")]
            public CreateMetaFields Fields { get; set; }
        }

        private class BulkResult
        {
            [JsonPropertyName("issues")]
            public List<BaseJiraItem> Issues { get; set; }

            [JsonPropertyName("errors")]
            public List<string> Errors { get; set; }
        }
    }
}
