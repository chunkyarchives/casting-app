namespace CastingApp.Application.Services.Media;

public static class MediaUrls
{
    public static string? ProfilePicture(Guid participantId, Guid? assetId) => assetId is { } id ? $"/api/participants/{participantId}/profile-picture?v={id:N}" : null;
    public static string Media(Guid assetId) => $"/api/media/{assetId}";
    public static string? Media(Guid? assetId) => assetId is { } id ? Media(id) : null;
    public static string? PublicProfilePicture(Guid participantId, Guid? assetId) => assetId is { } id ? $"/api/public/people/{participantId}/picture?v={id:N}" : null;
    public static string? PublicPoster(Guid filmId, Guid? posterId) => posterId is { } id ? $"/api/public/films/{filmId}/poster?v={id:N}" : null;
}