using Newtonsoft.Json;

namespace Model.Jira
{
    public class BaseJiraItem
    {
        [JsonProperty("self")]
        public string Self { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("key")]
        public string Key { get; set; }
    }
}
