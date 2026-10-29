using System.Text.RegularExpressions;

namespace Seedling.Cli.Database;

/// <summary>Strips passwords before a connection string reaches a log line.</summary>
public static partial class ConnectionStringSanitizer
{
    [GeneratedRegex(@"(?i)(password|pwd)\s*=\s*[^;]*", RegexOptions.CultureInvariant)]
    private static partial Regex Password();

    public static string Sanitize(string? connectionString)
        => connectionString is null ? "(none)" : Password().Replace(connectionString, "$1=*****");
}
