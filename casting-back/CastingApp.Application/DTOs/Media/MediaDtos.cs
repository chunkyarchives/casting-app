using CastingApp.Domain.Enums;

namespace CastingApp.Application.DTOs.Media;

public record ProfilePictureDto(Guid AssetId, string Url);

public record MediaItemDto(
    Guid Id,
    MediaKind Kind,
    string? Caption,
    string ContentType,
    long SizeBytes,
    DateTime CreatedAt,
    string Url);