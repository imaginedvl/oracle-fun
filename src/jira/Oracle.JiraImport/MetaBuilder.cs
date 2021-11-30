using Model.Jira;
using System;
using System.Collections.Generic;

namespace Model.Excel
{
    public class MetaBuilder
    {
        public List<CreateMetaFields> BuildMeta(JiraImportExcelFile excelFile)
        {
            var metas = new List<CreateMetaFields>();

            foreach (JiraImportStory story in excelFile.Stories)
            {
                metas.Add(new CreateMetaFields()
                {
                    Summary = story.Summary,
                    IssueType = new IssueType { Name = story.IssueType },
                    Assignee = new User { Name = excelFile.Assignee },
                    Project = new Project { Key = excelFile.Project },
                    AffectsVersions = new List<Model.Jira.Version> { new Model.Jira.Version { Name = excelFile.AffectsVersion } },
                    EpicLink = excelFile.EpicLink,
                    DevLead = new User { Name = excelFile.DevLead },
                    Description = story.Description
                });
            }

            Console.WriteLine("Built {0} issues' meta", metas.Count);
            return metas;
        }
    }
}
