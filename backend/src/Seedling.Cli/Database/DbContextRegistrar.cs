using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Seedling.Infrastructure.Persistence;

namespace Seedling.Cli.Database;

public static class DbContextRegistrar
{
    /// <summary>The same provider switch as the API, driven by the CLI's options instead of configuration.</summary>
    public static IServiceCollection AddSeedlingDbContext(this IServiceCollection services, DatabaseOptions options)
    {
        var cs = options.ResolveConnectionString();
        return services.AddDbContext<AppDbContext>(opt =>
        {
            if (options.Provider == DatabaseProvider.Sqlite)
                opt.UseSqlite(cs);
            else
                opt.UseSqlServer(cs, sql => sql.MigrationsAssembly(typeof(AppDbContext).Assembly.GetName().Name));
        });
    }
}
