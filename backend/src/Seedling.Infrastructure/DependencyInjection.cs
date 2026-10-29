using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Seedling.Application.Abstractions;
using Seedling.Application.Common;
using Seedling.Infrastructure.Persistence;

namespace Seedling.Infrastructure;

public static class DependencyInjection
{
    /// <summary>Configuration key selecting the database provider: <c>SqlServer</c> (default) or <c>Sqlite</c>.</summary>
    public const string DatabaseProviderKey = "Seedling:Database:Provider";

    /// <summary>The one environment variable the API, the CLI and the Worker all read for the connection string.</summary>
    public const string ConnectionEnvironmentVariable = "SEEDLING_CONNECTION";

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>((sp, opt) =>
        {
            var cfg = sp.GetRequiredService<IConfiguration>();
            var cs = Environment.GetEnvironmentVariable(ConnectionEnvironmentVariable)
                ?? cfg.GetConnectionString("Seedling")
                ?? throw new InvalidOperationException(
                    $"No connection string. Set {ConnectionEnvironmentVariable} or ConnectionStrings:Seedling.");
            if (UsesSqlite(cfg))
                opt.UseSqlite(cs);
            else
                opt.UseSqlServer(cs, sql => sql.MigrationsAssembly(typeof(AppDbContext).Assembly.GetName().Name));
        });

        services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddMemoryCache();
        services.AddSingleton<IDateTimeProvider, SystemDateTimeProvider>();

        return services;
    }

    /// <summary>
    /// SQLite is the development and test provider: no server, the schema created from the model
    /// on startup. Production refuses it; migrations are the only way a SQL Server schema changes.
    /// </summary>
    public static bool UsesSqlite(IConfiguration configuration)
        => string.Equals(configuration[DatabaseProviderKey], "Sqlite", StringComparison.OrdinalIgnoreCase);
}
