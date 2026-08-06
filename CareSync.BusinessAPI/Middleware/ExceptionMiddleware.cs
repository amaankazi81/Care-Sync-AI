using System.Net;
using CareSync.BusinessAPI.Helpers;

namespace CareSync.BusinessAPI.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch(Exception ex)
        {
            context.Response.StatusCode =
                (int)HttpStatusCode.InternalServerError;

            context.Response.ContentType =
                "application/json";

            var response =
                new ApiErrorResponse
                {
                    Message = ex.Message
                };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}