using Microsoft.AspNetCore.Http;
using Oracle.Core;
using Oracle.Web.Middlewares;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Oracle.Web.Middlewares
{
    


    public class HelpMiddleware
    {

        private readonly RequestDelegate _next;

        public HelpMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            httpContext.Response.Headers.Add("HELP", "HELP!!!");
            httpContext.Response.StatusCode = 200;
            await Task.CompletedTask;
        }   
    }
}


namespace Microsoft.AspNetCore.Builder
{
    public static class HelpMiddlewareExtensions
    {
        public static IApplicationBuilder UseHelp(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<HelpMiddleware>();
        }
    }
}

