using Microsoft.Extensions.Configuration;
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
            string stringTask = await client.GetStringAsync(url);
            JsonNode? o = JsonNode.Parse(stringTask!);
            if (o != null)
                Console.WriteLine(o!["state"]);
            else
                throw new JsonException(string.Format("Could not parse url GET:\n{0}\n{1}", url, stringTask));
        }
    }
}
