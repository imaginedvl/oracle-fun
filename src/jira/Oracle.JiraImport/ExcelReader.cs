using Model.Excel;
using Model.Jira;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;

namespace JiraImport
{
    public class ExcelReader
    {
        public JiraImportExcelFile ReadExcelFile(string path)
        {
            var fileContent = new JiraImportExcelFile();

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            Console.WriteLine("Reading {0}", path);
            using (var package = new ExcelPackage(new FileInfo(path)))
            {
                fileContent = ReadIdentification(package.Workbook.Worksheets["Identification"]);
                fileContent.Stories = ReadStories(package.Workbook.Worksheets["Issues"]);
                //ReadSubTasks(metas, package, devLead, assignee, affectsVersion, project);
            }

            return fileContent;
        }

        private void ReadSubTasks(List<CreateMetaFields> metas, ExcelPackage package, string devLead, string assignee, string affectsVersion, string project)
        {
            /*
            var subTasksSheet = package.Workbook.Worksheets["Sub-Tasks"];
            int nbRowsSub = subTasksSheet.Dimension.End.Row;
            for (int r = 4; r < nbRowsSub; r++)
            {
                var issueType = subTasksSheet.Cells[r, 3].Text;
                if (string.IsNullOrEmpty(issueType))
                {
                    break;
                }

                var parent = subTasksSheet.Cells[r, 4].Text;
                var summary = subTasksSheet.Cells[r, 5].Text;
                var description = subTasksSheet.Cells[r, 6].Text;

                if (IssueType.SubTask.Name.Equals(issueType))
                {
                    metas.Add(new CreateMetaFields
                    {
                        Summary = summary,
                        IssueType = new IssueType { Id = IssueType.SubTask.Id },
                        Assignee = new User { Name = assignee },
                        Project = new Project { Key = project },
                        AffectsVersions = new List<Model.Version> { new Model.Version { Name = affectsVersion } },
                        Parent = new Issue { Key = parent },
                        DevLead = new User { Name = devLead },
                        Description = description
                    });
                }
            }
            */
        }

        private List<JiraImportStory> ReadStories(ExcelWorksheet issuesSheet)
        {
            List<JiraImportStory> stories = new List<JiraImportStory>();

            int i = 1;
            int nbRows = issuesSheet.Dimension.End.Row;
            for (int r = 4; r < nbRows; r++)
            {
                var issueType = issuesSheet.Cells[r, 3].Text;
                if (string.IsNullOrEmpty(issueType))
                {
                    break;
                }

                var summary = issuesSheet.Cells[r, 4].Text;
                var description = issuesSheet.Cells[r, 5].Text;

                if (IssueType.SubTask.Name.Equals(issueType) == false)
                {
                    Console.WriteLine("Story {0}: {1}", i, summary);

                    stories.Add(new JiraImportStory
                    {
                        Summary = summary,
                        IssueType = issueType,
                        Description = description
                    });
                }
                i++;
            }

            return stories;
        }

        private JiraImportExcelFile ReadIdentification(ExcelWorksheet identificationSheet)
        {
            JiraImportExcelFile file = new JiraImportExcelFile();
            file.EpicLink = identificationSheet.Cells["C2"].Text;
            file.DevLead = identificationSheet.Cells["C3"].Text;
            file.Assignee = identificationSheet.Cells["C4"].Text;
            file.AffectsVersion = identificationSheet.Cells["C5"].Text;
            file.Project = identificationSheet.Cells["C6"].Text;
            
            Console.WriteLine("Main Epic will be {0}", file.EpicLink);
            return file;
        }
    }
}
