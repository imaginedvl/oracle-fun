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
    
    public class NelsonSafeAttribute: Attribute
    {

    }


    public class BasicAuthorizationMiddleware
    {

        private readonly RequestDelegate _next;

        public BasicAuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            bool isAuthorized = false;
            if(!isAuthorized)
            {
                string authorizationHeader = httpContext.Request.Headers["Authorization"];
                if (!string.IsNullOrWhiteSpace(authorizationHeader))
                {
                    string[] authorizationTokens = authorizationHeader.Split(new char[] { ' ' });
                    if (authorizationHeader.Length > 0)
                    {
                        if (authorizationTokens[0].Equals("BASIC", StringComparison.OrdinalIgnoreCase) && authorizationTokens.Length > 1)
                        {
                            Encoding encoding = Encoding.GetEncoding("UTF-8");
                            var usernameAndPassword = encoding.GetString(Convert.FromBase64String(authorizationTokens[1]));
                            string username = usernameAndPassword.Split(new char[] { ':' })[0];
                            string password = usernameAndPassword.Split(new char[] { ':' })[1];
                            if (username == "laurent" && password == "test")
                            {
                                // httpContext.Session.SetCurrentUserId("LDEVIGNE");
                                isAuthorized = true;
                            }
                        }
                    }

                }
            }
            if (isAuthorized)
            {
                await _next(httpContext);
            }
            else
            {
                httpContext.Response.StatusCode = 401;
                httpContext.Response.Headers.Add("WWW-Authenticate", "BASIC");
            }
        }
                
    }
}


namespace Microsoft.AspNetCore.Builder
{
    public static class BasicAuthMiddlewareExtensions
    {
        public static IApplicationBuilder UseBasicAuthorization(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<BasicAuthorizationMiddleware>();
        }
    }
}

