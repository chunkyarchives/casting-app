using CastingApp.Api.Auth;
using CastingApp.Application.DTOs.Auth;
using CastingApp.Application.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService auth, IWebHostEnvironment env) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<MeDto>> Register(RegisterRequest request)
    {
        var result = await auth.RegisterAsync(request);
        SetAuthCookie(result);
        return CreatedAtAction(nameof(Me), result.Me);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<MeDto>> Login(LoginRequest request)
    {
        var result = await auth.LoginAsync(request);
        SetAuthCookie(result);
        return Ok(result.Me);
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(AuthCookie.Name, BuildCookie(null));
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<MeDto>> Me() => Ok(await auth.GetMeAsync());

    private void SetAuthCookie(AuthResult result) =>
        Response.Cookies.Append(AuthCookie.Name, result.Token, BuildCookie(result.ExpiresAt));

    private CookieOptions BuildCookie(DateTime? expires) => new()
    {
        HttpOnly = true,                   
        Secure = !env.IsDevelopment(),      
        SameSite = SameSiteMode.Lax,
        Path = "/",
        Expires = expires
    };
}