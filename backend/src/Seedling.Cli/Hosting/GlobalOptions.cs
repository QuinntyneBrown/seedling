using System.CommandLine;
using Seedling.Cli.Database;

namespace Seedling.Cli.Hosting;

public static class GlobalOptions
{
    public static readonly Option<DatabaseProvider> Provider =
        new("--provider", () => DatabaseProvider.SqlServer, "Target database provider.");

    public static readonly Option<string?> Connection =
        new("--connection", "Override the connection string (otherwise SEEDLING_CONNECTION).");

    public static readonly Option<bool> Verbose =
        new("--verbose", "Emit debug-level logging.");
}
