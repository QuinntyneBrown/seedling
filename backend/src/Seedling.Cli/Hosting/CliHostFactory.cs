using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Seedling.Cli.Database;
using Seedling.Cli.Migrate;

namespace Seedling.Cli.Hosting;

/// <summary>One generic host per command: configuration, logging, the database and the handlers.</summary>
public static class CliHostFactory
{
    public static IHostBuilder Create(DatabaseOptions database, bool verbose)
        => Host.CreateDefaultBuilder()
            .ConfigureLogging(logging =>
            {
                logging.ClearProviders();
                logging.AddSimpleConsole(o => o.SingleLine = true);
                logging.SetMinimumLevel(verbose ? LogLevel.Debug : LogLevel.Information);
            })
            .ConfigureServices(services =>
            {
                services.AddSingleton(database);
                services.AddSeedlingDbContext(database);
                services.AddScoped<MigrateCommandHandler>();
            });
}
