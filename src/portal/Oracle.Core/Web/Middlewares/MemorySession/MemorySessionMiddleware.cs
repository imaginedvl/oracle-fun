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
    public class MemorySessionMiddleware
    {

        private static Dictionary<string, MemorySession> _sessions = new Dictionary<string, MemorySession>();
        private const string SESSION_COOKIE = "OracleFunSessionId";
        private readonly RequestDelegate _next;

        public MemorySessionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            MemorySession currentSession;
            if (!httpContext.Request.Cookies.TryGetValue(SESSION_COOKIE, out string value) || string.IsNullOrWhiteSpace(value) ||
                !_sessions.TryGetValue(value, out currentSession))
            {
                currentSession = new MemorySession();
                _sessions.Add(currentSession.Id, currentSession);
                httpContext.Response.Cookies.Append(SESSION_COOKIE, currentSession.Id);
            }
            httpContext.Session = currentSession;
            await _next(httpContext);
        }
                
    }
}


namespace Microsoft.AspNetCore.Builder
{
    public static class MemorySessionMiddlewareExtensions
    {
        public static IApplicationBuilder UseMemorySession(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<MemorySessionMiddleware>();
        }
    }
}

