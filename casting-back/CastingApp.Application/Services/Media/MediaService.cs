using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Media;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using CastingApp.Application.Services.Profiles;
using CastingApp.Application.Services.Public;

namespace CastingApp.Application.Services.Media;

public class MediaService(
    IAppDbContext db,
    IMediaStorage storage,
    ICurrentUser currentUser,
    IProfileCompletionService profileCompletion,
    IMediaMetadataCache cache,
    IImageProcessor images) : IMediaService
{
    public async Task<ProfilePictureDto> SetProfilePictureAsync(Stream content, long length, CancellationToken ct)
    {
        var userId = currentUser.Id;
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct)
            ?? throw new NotFoundException(nameof(Participant), userId);

        var oldAsset = user.ProfilePictureId is { } oldId
            ? await db.MediaAssets.FirstOrDefaultAsync(m => m.Id == oldId, ct)
            : null;

        var asset = await ValidateAndStoreAsync(MediaKind.ProfilePicture, null, content, length, ct);

        db.MediaAssets.Add(asset);
        user.ProfilePictureId = asset.Id;
        if (oldAsset is not null)
            db.MediaAssets.Remove(oldAsset);

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            await storage.DeleteAsync(asset.StorageKey, CancellationToken.None);
            throw new ConflictException("The profile picture was changed at the same time. Try again.");
        }

        await InvalidateProfilePictureAsync(userId, oldAsset?.Id, ct);
        await profileCompletion.RefreshAsync(userId, ct);

        if (oldAsset is not null)
            await TryDeleteFileAsync(oldAsset.StorageKey);

        return new ProfilePictureDto(asset.Id, MediaUrls.ProfilePicture(userId, asset.Id)!);
    }

    public async Task DeleteProfilePictureAsync(CancellationToken ct)
    {
        var userId = currentUser.Id;
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct)
            ?? throw new NotFoundException(nameof(Participant), userId);

        if (user.ProfilePictureId is not { } assetId)
            return;

        var asset = await db.MediaAssets.FirstOrDefaultAsync(m => m.Id == assetId, ct);

        user.ProfilePictureId = null;
        if (asset is not null)
            db.MediaAssets.Remove(asset);

        await db.SaveChangesAsync(ct);

        await InvalidateProfilePictureAsync(userId, asset?.Id, ct);
        await profileCompletion.RefreshAsync(userId, ct);

        if (asset is not null)
            await TryDeleteFileAsync(asset.StorageKey);
    }

    public async Task<MediaFile> GetProfilePictureAsync(Guid participantId, CancellationToken ct)
    {
        var meta = await ProfilePictureMetaAsync(participantId, ct)
            ?? throw new NotFoundException("Profile picture", participantId);

        EnsureCanViewProfilePicture(participantId, meta.OwnerRole!.Value);

        return await OpenAsync(meta, ct);
    }

    public async Task<MediaFile> GetPublicProfilePictureAsync(Guid participantId, CancellationToken ct)
    {
        var visible = await db.Users.AsNoTracking()
            .Where(u => u.Id == participantId)
            .AnyAsync(PublicVisibility.IsPublicProfile(DateTime.UtcNow), ct);

        if (!visible)
            throw new NotFoundException("Profile picture", participantId);

        var meta = await ProfilePictureMetaAsync(participantId, ct)
            ?? throw new NotFoundException("Profile picture", participantId);

        return await OpenAsync(meta, ct);
    }

    public async Task<MediaFile> GetPublicPosterAsync(Guid filmId, CancellationToken ct)
    {
        var posterId = await db.Films.AsNoTracking()
            .Where(f => f.Id == filmId)
            .Where(PublicVisibility.IsPublicFilm(DateTime.UtcNow))
            .Select(f => f.PosterId)
            .FirstOrDefaultAsync(ct);

        if (posterId is not { } id)
            throw new NotFoundException("Poster", filmId);

        var meta = await cache.GetAsync(id, ct)
            ?? await LoadMetaAsync(id, ct)
            ?? throw new NotFoundException("Poster", filmId);

        return await OpenAsync(meta, ct);
    }

    public async Task<MediaItemDto> AddAsync(MediaKind kind, string? caption, Stream content, long length, CancellationToken ct)
    {
        if (kind == MediaKind.ProfilePicture)
            throw new BadRequestException("Use the profile picture endpoint for profile pictures.");
        if (currentUser.Role != ParticipantRole.Actor)
            throw new ForbiddenException("Only actors have a portfolio.");

        var userId = currentUser.Id;
        var limit = MediaRules.MaxCount(kind);
        var count = await db.MediaAssets.CountAsync(m => m.OwnerId == userId && m.Kind == kind, ct);
        if (count >= limit)
            throw new ConflictException($"You can have at most {limit} items of this kind. Delete one first.");

        var asset = await ValidateAndStoreAsync(kind, caption, content, length, ct);

        db.MediaAssets.Add(asset);
        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch
        {
            await storage.DeleteAsync(asset.StorageKey, CancellationToken.None);
            throw;
        }

        return asset.ToItemDto();
    }

    public async Task<IReadOnlyList<MediaItemDto>> ListAsync(Guid actorId, bool showreels, CancellationToken ct)
    {
        if (!await db.Actors.AnyAsync(a => a.ParticipantId == actorId, ct))
            throw new NotFoundException(nameof(Actor), actorId);

        EnsureCanViewPortfolio(actorId);

        var query = db.MediaAssets.AsNoTracking().Where(m => m.OwnerId == actorId);
        query = showreels
            ? query.Where(m => m.Kind == MediaKind.Showreel)
            : query.Where(m => m.Kind != MediaKind.Showreel && m.Kind != MediaKind.ProfilePicture);

        var assets = await query.OrderByDescending(m => m.CreatedAt).ToListAsync(ct);
        return assets.Select(a => a.ToItemDto()).ToList();
    }

    public async Task<MediaFile> GetAsync(Guid mediaId, CancellationToken ct)
    {
        var meta = await cache.GetAsync(mediaId, ct)
            ?? await LoadMetaAsync(mediaId, ct)
            ?? throw new NotFoundException("Media", mediaId);

        // Pravo pristupa se računa na svaki zahtev, i kad su metapodaci iz keša
        switch (meta.Kind)
        {
            case MediaKind.ProfilePicture:
                var ownerRole = meta.OwnerRole
                    ?? throw new InvalidOperationException("A cached profile picture is missing its owner role.");
                EnsureCanViewProfilePicture(meta.OwnerId, ownerRole);
                break;

            case MediaKind.FilmPoster or MediaKind.RoleConceptArt:
                break;      // kao i sami filmovi, vidljive su svakom prijavljenom korisniku

            default:
                EnsureCanViewPortfolio(meta.OwnerId);
                break;
        }

        return await OpenAsync(meta, ct);
    }

    public async Task<MediaItemDto> UpdateCaptionAsync(Guid mediaId, string? caption, CancellationToken ct)
    {
        var userId = currentUser.Id;

        var asset = await db.MediaAssets.FirstOrDefaultAsync(m => m.Id == mediaId && m.OwnerId == userId, ct)
            ?? throw new NotFoundException("Media", mediaId);

        if (asset.Kind is not (MediaKind.Headshot or MediaKind.FullBody or MediaKind.ProductionStill or MediaKind.Showreel))
            throw new BadRequestException("Only portfolio pictures and showreels have a caption you can change here.");

        var text = string.IsNullOrWhiteSpace(caption) ? null : caption.Trim();
        if (text is { Length: > 140 })
            throw new BadRequestException("The caption is too long (max 140 characters).");

        asset.Caption = text;
        await db.SaveChangesAsync(ct);
        return asset.ToItemDto();
    }

    public async Task DeleteAsync(Guid mediaId, CancellationToken ct)
    {
        var userId = currentUser.Id;

        var asset = await db.MediaAssets.FirstOrDefaultAsync(m => m.Id == mediaId && m.OwnerId == userId, ct)
            ?? throw new NotFoundException("Media", mediaId);

        if (asset.Kind == MediaKind.ProfilePicture)
            throw new BadRequestException("Use the profile picture endpoint to remove a profile picture.");
        if (asset.Kind is MediaKind.FilmPoster or MediaKind.RoleConceptArt)
            throw new BadRequestException("Use the film and role endpoints to remove posters and concept art.");

        db.MediaAssets.Remove(asset);
        await db.SaveChangesAsync(ct);

        await cache.RemoveAssetAsync(asset.Id, ct);
        await TryDeleteFileAsync(asset.StorageKey);
    }

    public async Task<MediaItemDto> SetFilmPosterAsync(Guid filmId, Stream content, long length, CancellationToken ct)
    {
        var film = await db.Films.FirstOrDefaultAsync(f => f.Id == filmId, ct)
            ?? throw new NotFoundException(nameof(Film), filmId);

        EnsureDirectorOf(film.DirectorId);

        var oldPoster = film.PosterId is { } oldId
            ? await db.MediaAssets.FirstOrDefaultAsync(m => m.Id == oldId, ct)
            : null;

        var asset = await ValidateAndStoreAsync(MediaKind.FilmPoster, null, content, length, ct);

        db.MediaAssets.Add(asset);
        film.PosterId = asset.Id;
        if (oldPoster is not null)
            db.MediaAssets.Remove(oldPoster);

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            await storage.DeleteAsync(asset.StorageKey, CancellationToken.None);
            throw new ConflictException("The poster was changed at the same time. Try again.");
        }

        if (oldPoster is not null)
        {
            await cache.RemoveAssetAsync(oldPoster.Id, ct);
            await TryDeleteFileAsync(oldPoster.StorageKey);
        }

        return asset.ToItemDto();
    }

    public async Task DeleteFilmPosterAsync(Guid filmId, CancellationToken ct)
    {
        var film = await db.Films.FirstOrDefaultAsync(f => f.Id == filmId, ct)
            ?? throw new NotFoundException(nameof(Film), filmId);

        currentUser.EnsureOwnerOrAdmin(film.DirectorId);

        if (film.PosterId is not { } posterId)
            return;

        var poster = await db.MediaAssets.FirstOrDefaultAsync(m => m.Id == posterId, ct);

        film.PosterId = null;
        if (poster is not null)
            db.MediaAssets.Remove(poster);

        await db.SaveChangesAsync(ct);

        if (poster is not null)
        {
            await cache.RemoveAssetAsync(poster.Id, ct);
            await TryDeleteFileAsync(poster.StorageKey);
        }
    }

    public async Task<MediaItemDto> AddConceptArtAsync(Guid roleId, string? caption, Stream content, long length, CancellationToken ct)
    {
        var directorId = await db.FilmRoles.AsNoTracking()
            .Where(r => r.Id == roleId)
            .Select(r => (Guid?)r.Film.DirectorId)
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException(nameof(FilmRole), roleId);

        EnsureDirectorOf(directorId);

        var limit = MediaRules.MaxCount(MediaKind.RoleConceptArt);
        var count = await db.MediaAssets.CountAsync(m => m.FilmRoleId == roleId, ct);
        if (count >= limit)
            throw new ConflictException($"A role can have at most {limit} concept art pictures. Delete one first.");

        var asset = await ValidateAndStoreAsync(MediaKind.RoleConceptArt, caption, content, length, ct);
        asset.FilmRoleId = roleId;

        db.MediaAssets.Add(asset);
        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch
        {
            await storage.DeleteAsync(asset.StorageKey, CancellationToken.None);
            throw;
        }

        return asset.ToItemDto();
    }

    public async Task DeleteConceptArtAsync(Guid roleId, Guid mediaId, CancellationToken ct)
    {
        var asset = await db.MediaAssets.FirstOrDefaultAsync(m => m.Id == mediaId && m.FilmRoleId == roleId, ct)
            ?? throw new NotFoundException("Concept art", mediaId);

        // Concept art postavlja režiser filma, pa je on i vlasnik slike
        currentUser.EnsureOwnerOrAdmin(asset.OwnerId);

        db.MediaAssets.Remove(asset);
        await db.SaveChangesAsync(ct);

        await cache.RemoveAssetAsync(asset.Id, ct);
        await TryDeleteFileAsync(asset.StorageKey);
    }

    private async Task<MediaMeta?> LoadMetaAsync(Guid mediaId, CancellationToken ct)
    {
        var asset = await db.MediaAssets.AsNoTracking().FirstOrDefaultAsync(m => m.Id == mediaId, ct);
        if (asset is null)
            return null;

        ParticipantRole? ownerRole = null;
        if (asset.Kind == MediaKind.ProfilePicture)
        {
            ownerRole = await db.Users.AsNoTracking()
                .Where(u => u.Id == asset.OwnerId)
                .Select(u => (ParticipantRole?)u.Role)
                .FirstOrDefaultAsync(ct);
        }

        var meta = ToMeta(asset, ownerRole);
        await cache.SetAsync(meta, ct);
        return meta;
    }

    // Trenutna profilna slika učesnika: keš (id slike pa metapodaci), a ako nešto fali zovemo bazu
    private async Task<MediaMeta?> ProfilePictureMetaAsync(Guid participantId, CancellationToken ct)
    {
        if (await cache.GetProfilePictureIdAsync(participantId, ct) is { } cachedId
            && await cache.GetAsync(cachedId, ct) is { OwnerRole: not null } cachedMeta)
            return cachedMeta;

        var owner = await db.Users.AsNoTracking()
            .Where(u => u.Id == participantId)
            .Select(u => new { u.Role, u.ProfilePictureId })
            .FirstOrDefaultAsync(ct);

        if (owner?.ProfilePictureId is not { } assetId)
            return null;

        var asset = await db.MediaAssets.AsNoTracking().FirstOrDefaultAsync(m => m.Id == assetId, ct);
        if (asset is null)
            return null;

        var meta = ToMeta(asset, owner.Role);
        await cache.SetAsync(meta, ct);
        await cache.SetProfilePictureIdAsync(participantId, assetId, ct);
        return meta;
    }

    private async Task InvalidateProfilePictureAsync(Guid ownerId, Guid? assetId, CancellationToken ct)
    {
        await cache.RemoveProfilePictureAsync(ownerId, ct);
        if (assetId is { } id)
            await cache.RemoveAssetAsync(id, ct);
    }

    private static MediaMeta ToMeta(MediaAsset a, ParticipantRole? ownerRole) =>
        new(a.Id, a.OwnerId, a.Kind, a.ContentType, a.StorageKey, a.CreatedAt, ownerRole);

    private async Task<MediaAsset> ValidateAndStoreAsync(MediaKind kind, string? caption, Stream content, long length, CancellationToken ct)
    {
        if (length <= 0)
            throw new BadRequestException("The file is empty.");

        var max = MediaRules.MaxBytes(kind);
        if (length > max)
            throw new BadRequestException($"The file is too large (max {max / (1024 * 1024)} MB).");

        var isVideo = MediaRules.IsVideo(kind);
        var header = await ReadHeaderAsync(content, ct);
        var type = MediaRules.Detect(header);
        if (type is null || type.IsVideo != isVideo)
            throw new BadRequestException(isVideo
                ? "A showreel must be an MP4 or WebM video."
                : "Only JPEG, PNG and WebP images are allowed.");

        var text = string.IsNullOrWhiteSpace(caption) ? null : caption.Trim();
        if (text is { Length: > 140 })
            throw new BadRequestException("The caption is too long (max 140 characters).");

        // Poster i concept art se isecaju na svoj oblik; na disk ide obrađena slika, ne original
        if (MediaRules.Shape(kind) is { } shape)
        {
            var processed = images.CropToShape(content, shape);
            content = new MemoryStream(processed.Content);
            type = new DetectedType(processed.ContentType, processed.Extension, false);
            length = processed.Content.Length;
        }

        var userId = currentUser.Id;
        var asset = new MediaAsset
        {
            OwnerId = userId,
            Kind = kind,
            Caption = text,
            ContentType = type.ContentType,
            SizeBytes = length,
            CreatedAt = DateTime.UtcNow
        };
        asset.StorageKey = $"{MediaRules.Folder(kind)}/{userId:N}/{asset.Id:N}.{type.Extension}";

        // Sadržaj ide direktno na disk, bez učitavanja celog fajla u memoriju (video može da ima stotine MB)
        await storage.SaveAsync(asset.StorageKey, content, ct);
        return asset;
    }

    private static async Task<byte[]> ReadHeaderAsync(Stream content, CancellationToken ct)
    {
        if (!content.CanSeek)
            throw new InvalidOperationException("The upload stream must be seekable.");

        var header = new byte[64];
        var total = 0;
        while (total < header.Length)
        {
            var read = await content.ReadAsync(header.AsMemory(total), ct);
            if (read == 0)
                break;
            total += read;
        }

        content.Position = 0;
        return header[..total];
    }

    private async Task<MediaFile> OpenAsync(MediaMeta meta, CancellationToken ct)
    {
        var stream = await storage.OpenReadAsync(meta.StorageKey, ct)
            ?? throw new NotFoundException("Media", meta.AssetId);
        return new MediaFile(stream, meta.ContentType, meta.AssetId, meta.CreatedAt);
    }

    // Slike filma postavlja samo njegov režiser (admin ih može samo ukloniti)
    private void EnsureDirectorOf(Guid directorId)
    {
        if (currentUser.Id != directorId)
            throw new ForbiddenException("Only the film's director can add its pictures.");
    }

    private void EnsureCanViewProfilePicture(Guid ownerId, ParticipantRole ownerRole)
    {
        if (currentUser.IsAdmin() || currentUser.Id == ownerId)
            return;

        var allowed = ownerRole switch
        {
            ParticipantRole.Director => true,
            ParticipantRole.Actor or ParticipantRole.CastingDirector =>
                currentUser.Role is ParticipantRole.Director or ParticipantRole.CastingDirector,
            _ => false
        };

        if (!allowed)
            throw new ForbiddenException("You do not have access to this picture.");
    }

    private void EnsureCanViewPortfolio(Guid actorId)
    {
        if (currentUser.IsAdmin() || currentUser.Id == actorId)
            return;

        if (currentUser.Role is ParticipantRole.Director or ParticipantRole.CastingDirector)
            return;

        throw new ForbiddenException("You do not have access to this portfolio.");
    }

    private async Task TryDeleteFileAsync(string key)
    {
        try { await storage.DeleteAsync(key, CancellationToken.None); }
        catch {}
    }
}