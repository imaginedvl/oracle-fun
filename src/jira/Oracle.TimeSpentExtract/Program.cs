using Microsoft.Extensions.Configuration;

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
                .SetBasePath(Directory.GetParent(AppContext.BaseDirectory)!.FullName)
                .AddJsonFile("config.json", false)
                .Build();

            try
            {
                Console.WriteLine("Initialization...");
                JiraClient jiraClient = new(configuration);

                // Fetch the Epics and Stories and Sub-Tasks using the JQL
                // Sum up the time spent

                Console.WriteLine("Done! Press a key to quit.");
                Console.ReadKey();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}
