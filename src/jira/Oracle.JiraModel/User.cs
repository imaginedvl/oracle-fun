using Newtonsoft.Json;

namespace Model.Jira
{
    public class User : BaseJiraItem
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        public string DisplayName { get; set; }
    }
}
