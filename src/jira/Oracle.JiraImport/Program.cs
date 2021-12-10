using Microsoft.Extensions.Configuration;
using Model.Excel;
using Model.Jira;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
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
                Console.WriteLine("Initialization...");
                JiraClient jiraClient = new JiraClient(configuration);
                List<Issue> stories = new();

                var excelReader = new ExcelReader();
                var builder = new MetaBuilder();
                JiraImportExcelFile excelFile = excelReader.ReadExcelFile(args[0]);
                
                Console.WriteLine("Create parent issues...");
                var metas = builder.BuildStoriesMeta(excelFile);
                if (metas.Count > 0)
                {
                    List<BaseJiraItem> issues = await jiraClient.CreateIssuesAsync(metas);
                    foreach (BaseJiraItem bulkissue in issues)
                    {
                        Console.WriteLine(bulkissue.Self);
                    }

                    // apparently, need a small pause here to have the resources loaded in Jira
                    Thread.Sleep(5000);
                    string jql = string.Format("id in ({0})", string.Join(",", issues.Select(x => x.Id).ToArray()));
                    stories = await jiraClient.SearchIssuesAsync(jql, new string[] { "key", "summary" });
                }
                else
                {
                    Console.WriteLine("Skipped");
                }

                Console.WriteLine("Create children issues...");
                metas = builder.BuildSubTasksMeta(excelFile, stories);
                if (metas.Count > 0)
                {
                    List<BaseJiraItem> issues = await jiraClient.CreateIssuesAsync(metas);
                    foreach (BaseJiraItem bulkissue in issues)
                    {
                        Console.WriteLine(bulkissue.Self);
                    }
                }
                else
                {
                    Console.WriteLine("Skipped");
                }

                Console.WriteLine("Done!");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}
