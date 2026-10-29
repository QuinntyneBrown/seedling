namespace Seedling.Application.Abstractions;

/// <summary>
/// The persistence port handlers depend on. <c>Seedling.Infrastructure</c>'s <c>AppDbContext</c>
/// implements it; add one <c>DbSet&lt;TEntity&gt;</c> property per aggregate as entities arrive.
/// </summary>
public interface IAppDbContext
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
