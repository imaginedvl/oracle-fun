using Newtonsoft.Json;

namespace Model.Jira
{
    public class Version : BaseJiraItem
    {
        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
