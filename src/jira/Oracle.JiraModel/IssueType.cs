using Newtonsoft.Json;

namespace Model.Jira
{
    public class IssueType : BaseJiraItem
    {
        public static readonly IssueType SubTask = new() { Id = "5", Name = "Sub-task" };
        public static readonly IssueType Epic = new() { Id = "6", Name = "Epic" };
        public static readonly IssueType Story = new() { Id = "7", Name = "Story" };
        public static readonly IssueType Test = new() { Id = "27", Name = "Test" };

        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
