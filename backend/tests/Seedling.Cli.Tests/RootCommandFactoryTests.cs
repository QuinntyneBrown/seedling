using FluentAssertions;
using Seedling.Cli;
using Xunit;

namespace Seedling.Cli.Tests;

public sealed class RootCommandFactoryTests
{
    [Fact]
    public void Root_command_exposes_migrate()
    {
        var root = RootCommandFactory.Create();

        root.Subcommands.Select(c => c.Name).Should().Contain("migrate");
    }
}
