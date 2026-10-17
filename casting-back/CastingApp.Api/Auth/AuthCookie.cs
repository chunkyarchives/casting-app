using CastingApp.Application.Abstractions;

namespace CastingApp.Api.Auth;

public static class AuthCookie
{
    public const string Name = "casting_auth";
    public const string RefreshName = "casting_refresh"; 
    private const string RefreshPath = "/api/auth";

    public static void Append(HttpResponse response, IHostEnvironment env, AccessToken access, RefreshTokenIssue refresh)
    {
        response.Cookies.Append(Name, access.Value, Options(env, "/", access.ExpiresAt));
        response.Cookies.Append(RefreshName, refresh.Value, Options(env, RefreshPath, refresh.ExpiresAt));
    }

    public static void Clear(HttpResponse response, IHostEnvironment env)
    {
        response.Cookies.Delete(Name, Options(env, "/", null));
        response.Cookies.Delete(RefreshName, Options(env, RefreshPath, null));
    }

    private static CookieOptions Options(IHostEnvironment env, string path, DateTime? expiresUtc) => new()
    {
        HttpOnly = true,
        Secure = !env.IsDevelopment(),
        SameSite = SameSiteMode.Lax,
        Path = path,
        Expires = expiresUtc is { } e
            ? new DateTimeOffset(DateTime.SpecifyKind(e, DateTimeKind.Utc))
            : null
    };
}