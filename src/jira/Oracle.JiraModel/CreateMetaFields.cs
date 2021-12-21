using Newtonsoft.Json;
using System.Collections.Generic;

namespace Model.Jira
{
    public class CreateMetaFields
    {
        [JsonProperty("issuetype")]
        public IssueType IssueType { get; set; }

        [JsonProperty("summary")]
        public string Summary { get; set; }

        [JsonProperty("project")]
        public Project Project { get; set; }

        [JsonProperty("assignee")]
        public User Assignee { get; set; }

        [JsonProperty("versions")]
        public List<Version> AffectsVersions { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("customfield_10014")]
        public string EpicLink { get; set; }

        [JsonProperty("parent")]
        public Issue Parent { get; set; }

        [JsonProperty("customfield_10905")]
        public User DevLead { get; set; }
    }
}
