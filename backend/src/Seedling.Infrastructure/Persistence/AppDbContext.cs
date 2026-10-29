using Microsoft.EntityFrameworkCore;
using Seedling.Application.Abstractions;

namespace Seedling.Infrastructure.Persistence;

/// <summary>
/// The EF Core context. Entity mappings live in <c>Configurations/</c> (one
/// <c>IEntityTypeConfiguration</c> per entity) and are picked up by assembly scan.
/// </summary>
public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    /// <summary>
    /// On SQLite (development, tests) the schema comes straight from the model; migrations are
    /// authored and applied against SQL Server only.
    /// </summary>
    public Task EnsureSqliteSchemaAsync(CancellationToken cancellationToken = default)
        => Database.IsSqlite() ? Database.EnsureCreatedAsync(cancellationToken) : Task.CompletedTask;
}
