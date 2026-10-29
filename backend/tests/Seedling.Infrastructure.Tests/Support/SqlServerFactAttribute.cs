using Xunit;

namespace Seedling.Infrastructure.Tests.Support;

/// <summary>
/// A fact that needs a real SQL Server: skipped unless <c>SEEDLING_TEST_SQLSERVER</c> is set to
/// <c>localdb</c> or a server connection string. Pair with <c>[Trait("Category", "SqlServer")]</c>.
/// </summary>
public sealed class SqlServerFactAttribute : FactAttribute
{
    public const string EnvironmentVariable = "SEEDLING_TEST_SQLSERVER";

    public SqlServerFactAttribute()
    {
        if (string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable(EnvironmentVariable)))
            Skip = $"Set {EnvironmentVariable} to run the SQL Server-only tests.";
    }
}
