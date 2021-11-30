using Microsoft.Extensions.Configuration;
using Model;
using Model.Excel;
using Model.Jira;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace JiraImport
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
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
                var metas = builder.BuildMeta(excelFile);

                List<BaseJiraItem> issues = await jiraClient.CreateIssuesAsync(metas);
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
