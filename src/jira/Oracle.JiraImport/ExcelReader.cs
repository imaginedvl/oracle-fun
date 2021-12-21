using Model.Excel;
using Model.Jira;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;

namespace JiraImport
{
    public static class ExcelReader
    {
        public static JiraImportExcelFile ReadExcelFile(string path)
        {
            var fileContent = new JiraImportExcelFile();

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            Console.WriteLine("Reading {0}", path);
            using (var package = new ExcelPackage(new FileInfo(path)))
            {
                fileContent = ReadIdentification(package.Workbook.Worksheets["Identification"]);
                if (fileContent.ImportStories)
                {
                    fileContent.Stories = ReadStories(package.Workbook.Worksheets["Stories"]);
                }
                if (fileContent.ImportSubTasks)
                {
                    fileContent.SubTasks = ReadSubTasks(package.Workbook.Worksheets["Sub-Tasks"]);
                }
            }

            return fileContent;
        }

        private static List<JiraImportSubTask> ReadSubTasks(ExcelWorksheet sheet)
        {
            List<JiraImportSubTask> subtasks = new();

            int i = 1;
            int nbRows = sheet.Dimension.End.Row;
            for (int r = 4; r < nbRows; r++)
            {
                var issueType = sheet.Cells[r, 3].Text;
                if (string.IsNullOrEmpty(issueType))
                {
                    break;
                }

                // TODO: cover if parent is actually a story key (FRCE-1111)
                var parent = Convert.ToInt32(sheet.Cells[r, 4].Value);
                var summary = sheet.Cells[r, 5].Text;
                var description = sheet.Cells[r, 6].Text;

                if (IssueType.SubTask.Name.Equals(issueType) == true)
                {
                    Console.WriteLine("Sub-task {0}: {1} child of {2}", i, summary, parent);

                    subtasks.Add(new JiraImportSubTask
                    {
                        Parent = parent,
                        Summary = summary,
                        IssueType = issueType,
                        Description = description
                    });
                }
                i++;
            }

            return subtasks;
        }

        private static List<JiraImportStory> ReadStories(ExcelWorksheet sheet)
        {
            List<JiraImportStory> stories = new();

            int i = 1;
            int nbRows = sheet.Dimension.End.Row;
            for (int r = 4; r < nbRows; r++)
            {
                var issueType = sheet.Cells[r, 3].Text;
                if (string.IsNullOrEmpty(issueType))
                {
                    break;
                }

                var summary = sheet.Cells[r, 4].Text;
                var description = sheet.Cells[r, 5].Text;

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

        private static JiraImportExcelFile ReadIdentification(ExcelWorksheet sheet)
        {
            JiraImportExcelFile file = new()
            {
                EpicLink = sheet.Cells["C2"].Text,
                DevLead = sheet.Cells["C3"].Text,
                Assignee = sheet.Cells["C4"].Text,
                AffectsVersion = sheet.Cells["C5"].Text,
                Project = sheet.Cells["C6"].Text,
                ImportStories = sheet.Cells["C7"].Text == "Yes",
                ImportSubTasks = sheet.Cells["C8"].Text == "Yes"
            };

            Console.WriteLine("Main Epic will be {0}", file.EpicLink);
            return file;
        }
    }
}
