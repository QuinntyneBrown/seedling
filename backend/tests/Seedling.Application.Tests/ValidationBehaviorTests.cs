using FluentAssertions;
using FluentValidation;
using MediatR;
using Seedling.Application.Behaviors;
using Xunit;

namespace Seedling.Application.Tests;

public sealed class ValidationBehaviorTests
{
    private sealed record Echo(string Name) : IRequest<string>;

    private sealed class EchoValidator : AbstractValidator<Echo>
    {
        public EchoValidator() => RuleFor(e => e.Name).NotEmpty();
    }

    [Fact]
    public async Task A_failing_validator_stops_the_handler()
    {
        var behavior = new ValidationBehavior<Echo, string>([new EchoValidator()]);

        var act = () => behavior.Handle(new Echo(""), () => Task.FromResult("handled"), CancellationToken.None);

        var ex = await act.Should().ThrowAsync<Seedling.Application.Exceptions.ValidationException>();
        ex.Which.Errors.Should().ContainKey("Name");
    }

    [Fact]
    public async Task A_valid_request_reaches_the_handler()
    {
        var behavior = new ValidationBehavior<Echo, string>([new EchoValidator()]);

        var result = await behavior.Handle(new Echo("seed"), () => Task.FromResult("handled"), CancellationToken.None);

        result.Should().Be("handled");
    }
}
