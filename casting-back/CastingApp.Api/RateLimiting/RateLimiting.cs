using System.Collections.Concurrent;
using System.Globalization;
using Microsoft.AspNetCore.RateLimiting;
using StackExchange.Redis;

namespace CastingApp.Api.RateLimiting;

public static class RateLimitPolicies
{
    public const string Auth = "auth";                 // prijava i registracija
    public const string Refresh = "refresh";           // obnova sesije
    public const string JoinCrew = "join-crew";        // pristup ekipi preko koda
    public const string Upload = "upload";             // slike
    public const string UploadVideo = "upload-video";  // showreel
}

public sealed record RateLimitRule(int Permits, TimeSpan Window, bool PerIp = false);

public static class RateLimitRules
{
    public static readonly RateLimitRule General = new(300, TimeSpan.FromMinutes(1));

    private static readonly Dictionary<string, RateLimitRule> byPolicy = new()
    {
        [RateLimitPolicies.Auth] = new(10, TimeSpan.FromMinutes(1), PerIp: true),
        [RateLimitPolicies.Refresh] = new(30, TimeSpan.FromMinutes(1), PerIp: true),
        [RateLimitPolicies.JoinCrew] = new(5, TimeSpan.FromMinutes(10)),
        [RateLimitPolicies.Upload] = new(30, TimeSpan.FromMinutes(10)),
        [RateLimitPolicies.UploadVideo] = new(5, TimeSpan.FromMinutes(10))
    };

    public static RateLimitRule? Find(string policy) => byPolicy.GetValueOrDefault(policy);
}

public readonly record struct RateLimitResult(bool Allowed, TimeSpan RetryAfter);

public interface IRateLimitStore
{
    Task<RateLimitResult> HitAsync(string key, RateLimitRule rule, CancellationToken ct);
}

public sealed class RedisRateLimitStore(IConnectionMultiplexer redis, ILogger<RedisRateLimitStore> logger) : IRateLimitStore
{
    private const string IncrementScript = """
            local count = redis.call('INCR', KEYS[1])
            if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
            return { count, redis.call('PTTL', KEYS[1]) }
        """;

    private readonly MemoryRateLimitStore fallback = new();

    public async Task<RateLimitResult> HitAsync(string key, RateLimitRule rule, CancellationToken ct)
    {
        try
        {
            var raw = await redis.GetDatabase().ScriptEvaluateAsync(
                IncrementScript,
                ["casting:rl:" + key],
                [(long)rule.Window.TotalMilliseconds]);

            var values = (RedisResult[])raw!;
            var count = (long)values[0];
            var ttlMs = (long)values[1];

            return count <= rule.Permits
                ? new RateLimitResult(true, TimeSpan.Zero)
                : new RateLimitResult(false, TimeSpan.FromMilliseconds(Math.Max(ttlMs, 1000)));
        }
        catch (Exception ex) when (ex is RedisException or TimeoutException)
        {
            logger.LogWarning(ex, "Redis rate limiter is unavailable; using the in-memory limiter.");
            return fallback.Hit(key, rule);
        }
    }
}

public sealed class MemoryRateLimitStore
{
    private readonly ConcurrentDictionary<string, (int Count, DateTime ResetAt)> windows = new();

    public RateLimitResult Hit(string key, RateLimitRule rule)
    {
        var now = DateTime.UtcNow;

        var entry = windows.AddOrUpdate(key,
            _ => (1, now + rule.Window),
            (_, old) => old.ResetAt <= now ? (1, now + rule.Window) : (old.Count + 1, old.ResetAt));

        if (windows.Count > 10_000)   // povremeno čišćenje isteklih prozora
            foreach (var pair in windows)
                if (pair.Value.ResetAt <= now)
                    windows.TryRemove(pair.Key, out _);

        return entry.Count <= rule.Permits
            ? new RateLimitResult(true, TimeSpan.Zero)
            : new RateLimitResult(false, entry.ResetAt - now);
    }
}

public sealed class RateLimitingMiddleware(RequestDelegate next, IRateLimitStore store)
{
    public async Task InvokeAsync(HttpContext ctx)
    {
        var path = ctx.Request.Path;
        if (!path.StartsWithSegments("/api") && !path.StartsWithSegments("/hubs"))
        {
            await next(ctx);
            return;
        }

        var ip = "ip:" + (ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown");
        var who = ctx.User.FindFirst("sub")?.Value is { } userId ? "user:" + userId : ip;

        // Opšte ograničenje za ceo /api i /hubs
        var general = await store.HitAsync("general:" + who, RateLimitRules.General, ctx.RequestAborted);
        if (!general.Allowed)
        {
            await RejectAsync(ctx, general.RetryAfter);
            return;
        }

        // Ograničenje konkretnog endpointa, ako ga atribut [EnableRateLimiting] navodi
        var policy = ctx.GetEndpoint()?.Metadata.GetMetadata<EnableRateLimitingAttribute>()?.PolicyName;
        if (policy is not null && RateLimitRules.Find(policy) is { } rule)
        {
            var partition = rule.PerIp ? ip : who;
            var result = await store.HitAsync($"{policy}:{partition}", rule, ctx.RequestAborted);
            if (!result.Allowed)
            {
                await RejectAsync(ctx, result.RetryAfter);
                return;
            }
        }

        await next(ctx);
    }

    private static Task RejectAsync(HttpContext ctx, TimeSpan retryAfter)
    {
        var seconds = (int)Math.Ceiling(Math.Max(retryAfter.TotalSeconds, 1));
        ctx.Response.Headers.RetryAfter = seconds.ToString(CultureInfo.InvariantCulture);

        return Results.Problem(
                statusCode: StatusCodes.Status429TooManyRequests,
                title: "Too many requests",
                detail: "Too many requests. Try again later.")
            .ExecuteAsync(ctx);
    }
}

public static class RateLimitingExtensions
{
    public static IServiceCollection AddCastingRateLimiting(this IServiceCollection services)
    {
        services.AddSingleton<IRateLimitStore, RedisRateLimitStore>();
        return services;
    }

    public static IApplicationBuilder UseCastingRateLimiting(this IApplicationBuilder app)
        => app.UseMiddleware<RateLimitingMiddleware>();
}