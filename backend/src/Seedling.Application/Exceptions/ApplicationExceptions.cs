namespace Seedling.Application.Exceptions;

/// <summary>Request validation failed; the API answers 400 with a <c>ValidationProblemDetails</c>.</summary>
public sealed class ValidationException : Exception
{
    public ValidationException(IReadOnlyDictionary<string, string[]> errors)
        : base("One or more validation errors occurred.") => Errors = errors;

    public IReadOnlyDictionary<string, string[]> Errors { get; }
}

/// <summary>The request cannot be honoured as given; the API answers 400 with <paramref name="code"/>.</summary>
public sealed class BadRequestException(string code, string message) : Exception(message)
{
    public string Code { get; } = code;
}

/// <summary>The caller is authenticated but may not do this; the API answers 403.</summary>
public sealed class ForbiddenException(string code, string message) : Exception(message)
{
    public string Code { get; } = code;
}

/// <summary>The resource does not exist, or is outside the caller's tenant; the API answers 404.</summary>
public sealed class NotFoundException(string message) : Exception(message);

/// <summary>The request conflicts with current state; the API answers 409 with <paramref name="code"/>.</summary>
public sealed class ConflictException(string code, string message) : Exception(message)
{
    public string Code { get; } = code;
}
