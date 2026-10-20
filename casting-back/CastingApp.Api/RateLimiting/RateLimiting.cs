using System.Globalization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.DependencyInjection;

namespace CastingApp.Api.RateLimiting;

public static class RateLimitPolicies
{
    public const string Auth = "auth";                 // prijava i registracija
    public const string Refresh = "refresh";           // obnova sesije
    public const string JoinCrew = "join-crew";        // pristup ekipi preko koda
    public const string Upload = "upload";             // slike
    public const string UploadVideo = "upload-video";  // showreel
}

public static class RateLimitingExtensions
{
    public static IServiceCollection AddCastingRateLimiting(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.OnRejected = async (context, _) =>
            {
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    context.HttpContext.Response.Headers.RetryAfter =
                        ((int)Math.Ceiling(retryAfter.TotalSeconds)).ToString(CultureInfo.InvariantCulture);

                await Results.Problem(
                    statusCode: StatusCodes.Status429TooManyRequests,
                    title: "Too many requests",
                    detail: "Too many requests. Try again later.")
                    .ExecuteAsync(context.HttpContext);
            };

            // Opšte ograničenje za ceo /api: po korisniku, a ako nije prijavljen po IP adresi
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
                ctx.Request.Path.StartsWithSegments("/api") || ctx.Request.Path.StartsWithSegments("/hubs")
                    ? RateLimitPartition.GetFixedWindowLimiter(UserOrIp(ctx), _ => Fixed(300, TimeSpan.FromMinutes(1)))
                    : RateLimitPartition.GetNoLimiter("outside-api"));

            // Prijava i registracija: po IP adresi (zaključavanje po nalogu već postoji u Identity)
            options.AddPolicy(RateLimitPolicies.Auth, ctx =>
                RateLimitPartition.GetFixedWindowLimiter(Ip(ctx), _ => Fixed(10, TimeSpan.FromMinutes(1))));

            options.AddPolicy(RateLimitPolicies.Refresh, ctx =>
                RateLimitPartition.GetFixedWindowLimiter(Ip(ctx), _ => Fixed(30, TimeSpan.FromMinutes(1))));

            // Šifra ekipe ima 36^6 mogućnosti, a ovo sprečava pogađanje
            options.AddPolicy(RateLimitPolicies.JoinCrew, ctx =>
                RateLimitPartition.GetFixedWindowLimiter(UserOrIp(ctx), _ => Fixed(5, TimeSpan.FromMinutes(10))));

            options.AddPolicy(RateLimitPolicies.Upload, ctx =>
                RateLimitPartition.GetFixedWindowLimiter(UserOrIp(ctx), _ => Fixed(30, TimeSpan.FromMinutes(10))));

            options.AddPolicy(RateLimitPolicies.UploadVideo, ctx =>
                RateLimitPartition.GetFixedWindowLimiter(UserOrIp(ctx), _ => Fixed(5, TimeSpan.FromMinutes(10))));
        });

        return services;
    }

    private static FixedWindowRateLimiterOptions Fixed(int permits, TimeSpan window) => new()
    {
        PermitLimit = permits,
        Window = window,
        QueueLimit = 0,
        AutoReplenishment = true
    };

    private static string Ip(HttpContext ctx) => "ip:" + (ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown");

    private static string UserOrIp(HttpContext ctx)
    {
        var userId = ctx.User.FindFirst("sub")?.Value
            ?? ctx.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return userId is not null ? "user:" + userId : Ip(ctx);
    }
}