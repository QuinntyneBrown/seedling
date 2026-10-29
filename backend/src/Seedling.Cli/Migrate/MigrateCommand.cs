using System.CommandLine;
using System.CommandLine.Invocation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Seedling.Cli.Database;
using Seedling.Cli.Hosting;

namespace Seedling.Cli.Migrate;

/// <summary><c>seedling migrate</c>: applies pending EF Core migrations to the configured database.</summary>
public static class MigrateCommand
{
    public static Command Build()
    {
        var cmd = new Command("migrate", "Apply pending EF Core migrations to the configured database.");
        cmd.SetHandler(async (InvocationContext ctx) =>
        {
            var database = new DatabaseOptions
            {
                Provider = ctx.ParseResult.GetValueForOption(GlobalOptions.Provider),
                ConnectionString = ctx.ParseResult.GetValueForOption(GlobalOptions.Connection),
            };
            var verbose = ctx.ParseResult.GetValueForOption(GlobalOptions.Verbose);

            using var host = CliHostFactory.Create(database, verbose).Build();
            using var scope = host.Services.CreateScope();
            var handler = scope.ServiceProvider.GetRequiredService<MigrateCommandHandler>();
            ctx.ExitCode = await handler.ExecuteAsync(ctx.GetCancellationToken());
        });
        return cmd;
    }
}
