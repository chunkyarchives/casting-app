using CastingApp.Application.Services.Media;
using CastingApp.Domain.Entities;

namespace CastingApp.Application.DTOs.Media;

internal static class MediaMappings
{
    public static MediaItemDto ToItemDto(this MediaAsset a) => new(a.Id, a.Kind, a.Caption, a.ContentType, a.SizeBytes, a.CreatedAt, MediaUrls.Media(a.Id));
}