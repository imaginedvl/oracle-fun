using System.Text.Json.Serialization;

namespace Model.Jira
{
    public class User : BaseJiraItem
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        public string DisplayName { get; set; }
    }
}
