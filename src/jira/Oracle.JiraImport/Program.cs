using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace Oracle.JiraImport
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetParent(AppContext.BaseDirectory).FullName)
                .AddJsonFile("config.json", false)
                .Build();

            Console.WriteLine("Hello World!");
        }
    }
}
