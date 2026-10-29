using System.CommandLine;
using Seedling.Cli.Hosting;
using Seedling.Cli.Migrate;

namespace Seedling.Cli;

public static class RootCommandFactory
{
    public static RootCommand Create()
    {
        var root = new RootCommand("Seedling CLI — database migration, seeding and reset.");
        root.AddGlobalOption(GlobalOptions.Provider);
        root.AddGlobalOption(GlobalOptions.Connection);
        root.AddGlobalOption(GlobalOptions.Verbose);
        root.AddCommand(MigrateCommand.Build());
        // root.AddCommand(SeedCommand.Build());   // Seed/  — idempotent seed data from Seed/Data/*.json
        // root.AddCommand(ResetCommand.Build());  // Reset/ — drop and recreate, guarded outside Development
        return root;
    }
}
