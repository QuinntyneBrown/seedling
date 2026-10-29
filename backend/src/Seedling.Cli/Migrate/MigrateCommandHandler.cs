using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Seedling.Cli.Database;
using Seedling.Infrastructure.Persistence;

namespace Seedling.Cli.Migrate;

public sealed class MigrateCommandHandler
{
    private readonly AppDbContext _db;
    private readonly DatabaseOptions _options;
    private readonly ILogger<MigrateCommandHandler> _logger;

    public MigrateCommandHandler(AppDbContext db, DatabaseOptions options, ILogger<MigrateCommandHandler> logger)
    {
        _db = db;
        _options = options;
        _logger = logger;
    }

    public async Task<int> ExecuteAsync(CancellationToken ct)
    {
        _logger.LogInformation("Applying migrations to: {Target}", ConnectionStringSanitizer.Sanitize(_options.ResolveConnectionString()));
        if (_options.Provider == DatabaseProvider.Sqlite)
            await _db.EnsureSqliteSchemaAsync(ct);
        else
            await _db.Database.MigrateAsync(ct);
        _logger.LogInformation("Migrations applied.");
        return 0;
    }
}
