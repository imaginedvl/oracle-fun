namespace Model.Jira
{
    public class IssueType : BaseJiraItem
    {
        public static readonly IssueType SubTask = new IssueType() { Id = "5", Name = "Sub-task" };
        public static readonly IssueType Epic = new IssueType() { Id = "6", Name = "Epic" };
        public static readonly IssueType Story = new IssueType() { Id = "7", Name = "Story" };
        public static readonly IssueType Test = new IssueType() { Id = "27", Name = "Test" };

        public string Name { get; set; }
    }
}
