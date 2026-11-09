using CastingApp.Api.Auth;
using CastingApp.Api.RateLimiting;
using CastingApp.Application.DTOs.Accounts;
using CastingApp.Application.DTOs.Auth;
using CastingApp.Application.Services.Accounts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/me")]
public class AccountController(IAccountService account, IWebHostEnvironment env) : ControllerBase
{
    [HttpPut("visibility")]
    public async Task<ActionResult<MeDto>> UpdateVisibility(UpdateVisibilityRequest request, CancellationToken ct)
        => Ok(await account.UpdateVisibilityAsync(request, ct));

    [HttpPost("deactivate")]
    [EnableRateLimiting(RateLimitPolicies.Auth)]
    public async Task<IActionResult> Deactivate(DeactivateAccountRequest request, CancellationToken ct)
    {
        await account.DeactivateAsync(request, ct);
        AuthCookie.Clear(Response, env);
        return NoContent();
    }

    [HttpDelete]
    [EnableRateLimiting(RateLimitPolicies.Auth)]
    public async Task<IActionResult> Delete(DeleteAccountRequest request, CancellationToken ct)
    {
        await account.DeleteAsync(request, ct);
        AuthCookie.Clear(Response, env);
        return NoContent();
    }
}