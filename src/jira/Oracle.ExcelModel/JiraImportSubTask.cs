namespace Model.Excel
{
    public class JiraImportSubTask
    {
        public int Id { get; set; }

        public int Parent { get; set; }

        public string IssueType { get; set; }

        public string Summary { get; set; }

        public string Description { get; set; }
    }
}
