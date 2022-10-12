using System.Text.Json.Serialization;

namespace Model.Jira
{
    public class Version : BaseJiraItem
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
    }
}
