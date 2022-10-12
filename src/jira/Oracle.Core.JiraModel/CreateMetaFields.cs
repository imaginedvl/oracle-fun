using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Model.Jira
{
    public class CreateMetaFields
    {
        [JsonPropertyName("issuetype")]
        public IssueType IssueType { get; set; }

        [JsonPropertyName("summary")]
        public string Summary { get; set; }

        [JsonPropertyName("project")]
        public Project Project { get; set; }

        [JsonPropertyName("assignee")]
        public User Assignee { get; set; }

        [JsonPropertyName("versions")]
        public List<Version> AffectsVersions { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("customfield_10014")]
        public string EpicLink { get; set; }

        [JsonPropertyName("parent")]
        public Issue Parent { get; set; }

        [JsonPropertyName("customfield_10905")]
        public User DevLead { get; set; }
    }
}
