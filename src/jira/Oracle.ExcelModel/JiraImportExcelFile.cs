using System.Collections.Generic;

namespace Model.Excel
{
    public class JiraImportExcelFile
    {
        public string EpicLink { get; set; }

        public string DevLead { get; set; }

        public string Assignee { get; set; }

        public string AffectsVersion { get; set; }

        public string Project { get; set; }

        public List<JiraImportStory> Stories { get; set; } = new List<JiraImportStory>();
    }
}
