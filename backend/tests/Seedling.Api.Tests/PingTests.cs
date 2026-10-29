using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Seedling.Api.Tests.Support;
using Xunit;

namespace Seedling.Api.Tests;

public sealed class PingTests : IClassFixture<SeedlingApiFactory>
{
    private readonly HttpClient _client;

    public PingTests(SeedlingApiFactory factory) => _client = factory.CreateClient();

    [Fact]
    public async Task Ping_answers_without_a_session()
    {
        var response = await _client.GetAsync("/api/_ping");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<PingBody>();
        body!.Status.Should().Be("ok");
    }

    private sealed record PingBody(string Status, DateTimeOffset ServerTimeUtc);
}
