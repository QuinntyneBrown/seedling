using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Seedling.Api.Controllers;

/// <summary>The pipeline smoke endpoint the deploy workflow and the API tests call.</summary>
[ApiController]
[Route("api/_ping")]
public sealed class PingController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public ActionResult<PingResponse> Get() => Ok(new PingResponse("ok", DateTimeOffset.UtcNow));
}

public sealed record PingResponse(string Status, DateTimeOffset ServerTimeUtc);
