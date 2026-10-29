using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Seedling.Infrastructure;
using Xunit;

namespace Seedling.Api.Tests.Support;

/// <summary>
/// Boots the API in-process against a per-fixture in-memory SQLite database. The API creates
/// the schema on startup; the database goes when the fixture is disposed. Derived fixtures
/// override <see cref="OverrideSettings"/> and swap external ports in <c>ConfigureTestServices</c>.
/// </summary>
public class SeedlingApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    public string DatabaseName { get; } = $"Seedling_Api_{Guid.NewGuid():N}";

    /// <summary>A named shared-cache database: every DbContext the API opens reaches the same one.</summary>
    public string ConnectionString => $"Data Source={DatabaseName};Mode=Memory;Cache=Shared";

    /// <summary>An in-memory SQLite database lives as long as one connection to it is open.</summary>
    private SqliteConnection? _keepAlive;

    protected virtual IDictionary<string, string?> OverrideSettings => new Dictionary<string, string?>();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, cfg) =>
        {
            cfg.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:Seedling"] = ConnectionString,
                [DependencyInjection.DatabaseProviderKey] = "Sqlite",
                ["Seedling:Jwt:Issuer"] = "seedling-test",
                ["Seedling:Jwt:Audience"] = "seedling-test-clients",
                ["Seedling:Jwt:SigningKey"] = "test-only-signing-key-must-be-at-least-32-bytes-long",
            });
            cfg.AddInMemoryCollection(OverrideSettings);
        });
    }

    public async Task InitializeAsync()
    {
        _keepAlive = new SqliteConnection(ConnectionString);
        await _keepAlive.OpenAsync();
        // Building the host creates the schema.
        _ = Services;
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        if (_keepAlive is not null) await _keepAlive.DisposeAsync();
        await base.DisposeAsync();
    }
}
