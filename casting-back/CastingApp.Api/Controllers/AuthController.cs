using CastingApp.Api.Auth;
using CastingApp.Api.RateLimiting;
using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Auth;
using CastingApp.Application.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService auth, ISessionService sessions, IWebHostEnvironment env) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimitPolicies.Auth)]
    public async Task<ActionResult<MeDto>> Register(RegisterRequest request, CancellationToken ct)
    {
        var result = await auth.RegisterAsync(request);
        await StartSessionAsync(result, ct);
        return CreatedAtAction(nameof(Me), result.Me);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimitPolicies.Auth)]
    public async Task<ActionResult<MeDto>> Login(LoginRequest request, CancellationToken ct)
    {
        var result = await auth.LoginAsync(request);
        await StartSessionAsync(result, ct);
        return Ok(result.Me);
    }

    // Mora biti AllowAnonymous: poziva se upravo kad je access token istekao
    [HttpPost("refresh")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimitPolicies.Refresh)]
    public async Task<IActionResult> Refresh(CancellationToken ct)
    {
        try
        {
            var result = await sessions.RefreshAsync(Request.Cookies[AuthCookie.RefreshName], ct);
            AuthCookie.Append(Response, env, result.Access, result.Refresh);
            return NoContent();
        }
        catch (UnauthorizedException ex)
        {
            AuthCookie.Clear(Response, env);
            return Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: ex.Message);
        }
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        await sessions.EndAsync(Request.Cookies[AuthCookie.RefreshName], ct);
        AuthCookie.Clear(Response, env);
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<MeDto>> Me() => Ok(await auth.GetMeAsync());

    private async Task StartSessionAsync(AuthResult result, CancellationToken ct)
    {
        await sessions.EndAsync(Request.Cookies[AuthCookie.RefreshName], ct);

        var refresh = await sessions.StartAsync(result.Me.Id, ct);
        AuthCookie.Append(Response, env, new AccessToken(result.Token, result.ExpiresAt), refresh);
    }
}