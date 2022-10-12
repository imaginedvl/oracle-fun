using System.Text.Json.Serialization;

namespace Model.Jira
{
    public class Project : BaseJiraItem
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
    }
}
