using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Oracle.Core;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Linq;

namespace Oracle.Portal
{

    public class Program
    {

        public static void Main(string[] args)
        {            
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
