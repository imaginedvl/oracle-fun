using Newtonsoft.Json;
using System.Collections.Generic;

namespace Model.Jira
{
    public class CreateMetaFields
    {
        public IssueType IssueType { get; set; }

        public string Summary { get; set; }

        public Project Project { get; set; }

        public User Assignee { get; set; }

        [JsonProperty("versions")]
        public List<Version> AffectsVersions { get; set; }

        public string Description { get; set; }

        [JsonProperty("customfield_10014")]
        public string EpicLink { get; set; }

        public Issue Parent { get; set; }

        [JsonProperty("customfield_10905")]
        public User DevLead { get; set; }
    }
}
