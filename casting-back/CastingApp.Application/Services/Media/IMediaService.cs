using CastingApp.Application.DTOs.Media;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.Services.Media;

public record MediaFile(Stream Content, string ContentType, Guid AssetId, DateTime CreatedAtUtc);

public interface IMediaService
{
    Task<ProfilePictureDto> SetProfilePictureAsync(Stream content, long length, CancellationToken ct);
    Task DeleteProfilePictureAsync(CancellationToken ct);
    Task<MediaFile> GetProfilePictureAsync(Guid participantId, CancellationToken ct);
    Task<MediaFile> GetPublicProfilePictureAsync(Guid participantId, CancellationToken ct);
    Task<MediaFile> GetPublicPosterAsync(Guid filmId, CancellationToken ct);
    Task<MediaItemDto> AddAsync(MediaKind kind, string? caption, Stream content, long length, CancellationToken ct);
    Task<IReadOnlyList<MediaItemDto>> ListAsync(Guid actorId, bool showreels, CancellationToken ct);
    Task<MediaFile> GetAsync(Guid mediaId, CancellationToken ct);
    Task DeleteAsync(Guid mediaId, CancellationToken ct);
    Task<MediaItemDto> SetFilmPosterAsync(Guid filmId, Stream content, long length, CancellationToken ct);
    Task DeleteFilmPosterAsync(Guid filmId, CancellationToken ct);
    Task<MediaItemDto> AddConceptArtAsync(Guid roleId, string? caption, Stream content, long length, CancellationToken ct);
    Task DeleteConceptArtAsync(Guid roleId, Guid mediaId, CancellationToken ct);
}