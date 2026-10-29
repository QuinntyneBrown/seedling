using Seedling.Infrastructure;

namespace Seedling.Cli.Database;

public sealed class DatabaseOptions
{
    public DatabaseProvider Provider { get; init; } = DatabaseProvider.SqlServer;

    /// <summary>The explicit override; otherwise <c>SEEDLING_CONNECTION</c>.</summary>
    public string? ConnectionString { get; init; }

    public string ResolveConnectionString()
        => ConnectionString
           ?? Environment.GetEnvironmentVariable(DependencyInjection.ConnectionEnvironmentVariable)
           ?? throw new InvalidOperationException(
               $"No connection string. Pass --connection or set {DependencyInjection.ConnectionEnvironmentVariable}.");
}
