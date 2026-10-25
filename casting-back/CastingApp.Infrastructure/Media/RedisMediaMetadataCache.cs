using System.Text.Json;
using System.Text.Json.Serialization;
using CastingApp.Application.Abstractions;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace CastingApp.Infrastructure.Media;

// Keš metapodataka u Redisu. Svaka greška Redisa je samo promašaj keša: čita se iz baze
public sealed class RedisMediaMetadataCache(
    IConnectionMultiplexer redis,
    ILogger<RedisMediaMetadataCache> logger,
    TimeSpan ttl) : IMediaMetadataCache
{
    private static readonly JsonSerializerOptions json = new() { Converters = { new JsonStringEnumConverter() } };

    private bool Enabled => ttl > TimeSpan.Zero; 

    public async Task<MediaMeta?> GetAsync(Guid assetId, CancellationToken ct)
    {
        if (!Enabled) return null;
        try
        {
            var value = await redis.GetDatabase().StringGetAsync(AssetKey(assetId));
            return value.IsNullOrEmpty ? null : JsonSerializer.Deserialize<MediaMeta>(value.ToString(), json);
        }
        catch (Exception ex) when (IsCacheFailure(ex))
        {
            Warn(ex);
            return null;
        }
    }

    public Task SetAsync(MediaMeta meta, CancellationToken ct) =>
        RunAsync(db => db.StringSetAsync(AssetKey(meta.AssetId), JsonSerializer.Serialize(meta, json), ttl));

    public Task RemoveAssetAsync(Guid assetId, CancellationToken ct) =>
        RunAsync(db => db.KeyDeleteAsync(AssetKey(assetId)));

    public async Task<Guid?> GetProfilePictureIdAsync(Guid participantId, CancellationToken ct)
    {
        if (!Enabled) return null;
        try
        {
            var value = await redis.GetDatabase().StringGetAsync(ProfileKey(participantId));
            return !value.IsNullOrEmpty && Guid.TryParse(value.ToString(), out var id) ? id : null;
        }
        catch (Exception ex) when (IsCacheFailure(ex))
        {
            Warn(ex);
            return null;
        }
    }

    public Task SetProfilePictureIdAsync(Guid participantId, Guid assetId, CancellationToken ct) =>
        RunAsync(db => db.StringSetAsync(ProfileKey(participantId), assetId.ToString("N"), ttl));

    public Task RemoveProfilePictureAsync(Guid participantId, CancellationToken ct) =>
        RunAsync(db => db.KeyDeleteAsync(ProfileKey(participantId)));

    private async Task RunAsync(Func<IDatabase, Task> action)
    {
        if (!Enabled) return;
        try
        {
            await action(redis.GetDatabase());
        }
        catch (Exception ex) when (IsCacheFailure(ex))
        {
            Warn(ex);
        }
    }

    private static bool IsCacheFailure(Exception ex) => ex is RedisException or TimeoutException or JsonException;

    private void Warn(Exception ex) => logger.LogWarning(ex, "Redis media cache is unavailable; reading from the database.");

    private static string AssetKey(Guid id) => $"casting:media:{id:N}";
    private static string ProfileKey(Guid participantId) => $"casting:profile-picture:{participantId:N}";
}