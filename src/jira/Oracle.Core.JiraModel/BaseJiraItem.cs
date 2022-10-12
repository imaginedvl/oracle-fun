using System.Text.Json.Serialization;

namespace Model.Jira
{
    public class BaseJiraItem
    {
        [JsonPropertyName("self")]
        public string Self { get; set; }

        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("key")]
        public string Key { get; set; }
    }
}
