using CastingApp.Domain.Enums;

namespace CastingApp.Application.Abstractions;

public sealed record MediaMeta(
    Guid AssetId,
    Guid OwnerId,
    MediaKind Kind,
    string ContentType,
    string StorageKey,
    DateTime CreatedAt,
    ParticipantRole? OwnerRole);

public interface IMediaMetadataCache
{
    Task<MediaMeta?> GetAsync(Guid assetId, CancellationToken ct);
    Task SetAsync(MediaMeta meta, CancellationToken ct);
    Task RemoveAssetAsync(Guid assetId, CancellationToken ct);

    Task<Guid?> GetProfilePictureIdAsync(Guid participantId, CancellationToken ct);
    Task SetProfilePictureIdAsync(Guid participantId, Guid assetId, CancellationToken ct);
    Task RemoveProfilePictureAsync(Guid participantId, CancellationToken ct);
}