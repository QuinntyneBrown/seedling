using Microsoft.AspNetCore.Mvc;
using Seedling.Application.Exceptions;

namespace Seedling.Api.Middleware;

/// <summary>Maps the application's exceptions to ProblemDetails responses; everything else is a logged 500.</summary>
public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            await WriteAsync(context, StatusCodes.Status400BadRequest, "Validation failed", ex.Message, errors: ex.Errors);
        }
        catch (BadRequestException ex)
        {
            await WriteAsync(context, StatusCodes.Status400BadRequest, "Bad request", ex.Message, code: ex.Code);
        }
        catch (ForbiddenException ex)
        {
            await WriteAsync(context, StatusCodes.Status403Forbidden, "Forbidden", ex.Message, code: ex.Code);
        }
        catch (NotFoundException ex)
        {
            await WriteAsync(context, StatusCodes.Status404NotFound, "Not found", ex.Message);
        }
        catch (ConflictException ex)
        {
            await WriteAsync(context, StatusCodes.Status409Conflict, "Conflict", ex.Message, code: ex.Code);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception processing {Path}", context.Request.Path);
            await WriteAsync(context, StatusCodes.Status500InternalServerError, "Server error", "An unexpected error occurred.");
        }
    }

    private static async Task WriteAsync(
        HttpContext context,
        int statusCode,
        string title,
        string detail,
        IReadOnlyDictionary<string, string[]>? errors = null,
        string? code = null)
    {
        if (context.Response.HasStarted) return;

        context.Response.StatusCode = statusCode;

        ProblemDetails pd = errors is not null
            ? new ValidationProblemDetails(errors.ToDictionary(kv => kv.Key, kv => kv.Value))
            : new ProblemDetails();

        pd.Status = statusCode;
        pd.Title = title;
        pd.Detail = detail;
        pd.Type = $"https://httpstatuses.io/{statusCode}";
        pd.Instance = context.Request.Path;
        if (code is not null) pd.Extensions["code"] = code;

        await context.Response.WriteAsJsonAsync(pd, pd.GetType(), options: null, contentType: "application/problem+json");
    }
}
