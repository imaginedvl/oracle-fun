namespace Model.Jira
{
    public class Issue: BaseJiraItem
    {
        public IssueFields Fields { get; set; }

        public class IssueFields
        {
            public IssueType IssueType { get; set; }
            public Version AffectsVersion { get; set; }
            public Status Status { get; set; }
            public string Summary { get; set; }
            public string Description { get; set; }
        }
    }
}
