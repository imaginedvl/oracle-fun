using Microsoft.Extensions.Configuration;
using Model.Excel;
using Model.Jira;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace JiraImport
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            if (args.Length != 1)
            {
                Console.WriteLine("Need to specify the Excel file to import from.");
                return;
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetParent(AppContext.BaseDirectory).FullName)
                .AddJsonFile("config.json", false)
                .Build();

            try
            {
                JiraClient jiraClient = new JiraClient(configuration);

                var excelReader = new ExcelReader();
                var builder = new MetaBuilder();
                JiraImportExcelFile excelFile = excelReader.ReadExcelFile(args[0]);
                var metas = builder.BuildStoriesMeta(excelFile);

                List<BaseJiraItem> issues = await jiraClient.CreateIssuesAsync(metas);
                string jql = "id in ({0})";
                foreach (BaseJiraItem bulkissue in issues)
                {
                    Console.WriteLine(bulkissue.Self);
                }
                jql = string.Format(jql, string.Join(",", issues.Select(x => x.Id).ToArray()));
                List<Issue> stories = await jiraClient.SearchIssuesAsync(jql, new string[] {"key", "summary"});

                metas = builder.BuildSubTasksMeta(excelFile, stories);
                issues = await jiraClient.CreateIssuesAsync(metas);
                foreach (BaseJiraItem bulkissue in issues)
                {
                    Console.WriteLine(bulkissue.Self);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}
