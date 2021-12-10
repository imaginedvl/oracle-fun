using Model.Jira;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Model.Excel
{
    public class MetaBuilder
    {
        public List<CreateMetaFields> BuildStoriesMeta(JiraImportExcelFile excelFile)
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

        public List<CreateMetaFields> BuildSubTasksMeta(JiraImportExcelFile excelFile, List<Issue> stories)
        {
            var metas = new List<CreateMetaFields>();

            foreach (JiraImportSubTask subTask in excelFile.SubTasks)
            {
                JiraImportStory s = excelFile.Stories[subTask.Parent - 1];
                var storyKey = (from Issue i in stories
                                where i.Fields.Summary == s.Summary
                                select i.Key).FirstOrDefault();
                if (string.IsNullOrEmpty(storyKey))
                {
                    throw new Exception(string.Format("Cannot find parent {0} ({1}) for {2}", subTask.Parent, s.Summary, subTask.Summary));
                }

                metas.Add(new CreateMetaFields()
                {
                    Summary = subTask.Summary,
                    IssueType = new IssueType { Name = subTask.IssueType },
                    Assignee = new User { Name = excelFile.Assignee },
                    Project = new Project { Key = excelFile.Project },
                    AffectsVersions = new List<Model.Jira.Version> { new Model.Jira.Version { Name = excelFile.AffectsVersion } },
                    Parent = new Issue { Key = storyKey },
                    DevLead = new User { Name = excelFile.DevLead },
                    Description = subTask.Description
                });
            }

            Console.WriteLine("Built {0} issues' meta", metas.Count);
            return metas;
        }
    }
}
