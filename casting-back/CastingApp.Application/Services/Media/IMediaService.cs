using CastingApp.Application.DTOs.Media;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.Services.Media;

public record MediaFile(Stream Content, string ContentType, Guid AssetId, DateTime CreatedAtUtc);

public interface IMediaService
{
    Task<ProfilePictureDto> SetProfilePictureAsync(Stream content, long length, CancellationToken ct);
    Task DeleteProfilePictureAsync(CancellationToken ct);
    Task<MediaFile> GetProfilePictureAsync(Guid participantId, CancellationToken ct);
    Task<MediaItemDto> AddAsync(MediaKind kind, string? caption, Stream content, long length, CancellationToken ct);
    Task<IReadOnlyList<MediaItemDto>> ListAsync(Guid actorId, bool showreels, CancellationToken ct);
    Task<MediaFile> GetAsync(Guid mediaId, CancellationToken ct);
    Task DeleteAsync(Guid mediaId, CancellationToken ct);
}