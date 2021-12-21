using Newtonsoft.Json;

namespace Model.Jira
{
    public class Project : BaseJiraItem
    {
        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
