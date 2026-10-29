using FluentAssertions;
using Seedling.Infrastructure.Tests.Support;
using Xunit;

namespace Seedling.Infrastructure.Tests.Persistence;

public sealed class SchemaTests
{
    [Fact]
    public async Task The_model_creates_its_schema_on_sqlite()
    {
        await using var db = await TestDatabase.CreateAsync();
        await using var ctx = db.CreateContext();

        var canConnect = await ctx.Database.CanConnectAsync();

        canConnect.Should().BeTrue();
    }
}
