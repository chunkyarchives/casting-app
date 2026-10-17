using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Media;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Media;

public class MediaService(IAppDbContext db, IMediaStorage storage, ICurrentUser currentUser) : IMediaService
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

        // Novi red, pokazivač na njega i brisanje starog reda idu u jednu transakciju.
        // Pokazivač prvo prebacujemo na novu sliku, pa tek onda brišemo staru.
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

        if (oldAsset is not null)
            await TryDeleteFileAsync(oldAsset.StorageKey);

        return new ProfilePictureDto(asset.Id, $"/api/participants/{userId}/profile-picture?v={asset.Id:N}");
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

        if (asset is not null)
            await TryDeleteFileAsync(asset.StorageKey);
    }

    public async Task<MediaFile> GetProfilePictureAsync(Guid participantId, CancellationToken ct)
    {
        var owner = await db.Users.AsNoTracking()
            .Where(u => u.Id == participantId)
            .Select(u => new { u.Role, u.ProfilePictureId })
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException("Profile picture", participantId);

        EnsureCanViewProfilePicture(participantId, owner.Role);

        var asset = owner.ProfilePictureId is { } assetId
            ? await db.MediaAssets.AsNoTracking().FirstOrDefaultAsync(m => m.Id == assetId, ct)
            : null;
        if (asset is null)
            throw new NotFoundException("Profile picture", participantId);

        return await OpenAsync(asset, ct);
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
            await storage.DeleteAsync(asset.StorageKey, CancellationToken.None);   // bez reda u bazi fajl nikome ne treba
            throw;
        }

        return ToItemDto(asset);
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
        return assets.Select(ToItemDto).ToList();
    }

    public async Task<MediaFile> GetAsync(Guid mediaId, CancellationToken ct)
    {
        var asset = await db.MediaAssets.AsNoTracking().FirstOrDefaultAsync(m => m.Id == mediaId, ct)
            ?? throw new NotFoundException("Media", mediaId);

        if (asset.Kind == MediaKind.ProfilePicture)
        {
            var ownerRole = await db.Users.AsNoTracking()
                .Where(u => u.Id == asset.OwnerId)
                .Select(u => u.Role)
                .FirstAsync(ct);
            EnsureCanViewProfilePicture(asset.OwnerId, ownerRole);
        }
        else
        {
            EnsureCanViewPortfolio(asset.OwnerId);
        }

        return await OpenAsync(asset, ct);
    }

    public async Task DeleteAsync(Guid mediaId, CancellationToken ct)
    {
        var userId = currentUser.Id;

        var asset = await db.MediaAssets.FirstOrDefaultAsync(m => m.Id == mediaId && m.OwnerId == userId, ct)
            ?? throw new NotFoundException("Media", mediaId);

        if (asset.Kind == MediaKind.ProfilePicture)
            throw new BadRequestException("Use the profile picture endpoint to remove a profile picture.");

        db.MediaAssets.Remove(asset);
        await db.SaveChangesAsync(ct);

        await TryDeleteFileAsync(asset.StorageKey);
    }


    // Provere (veličina, tip po potpisu fajla, vrsta) pa upis na disk. Red u bazi pravi pozivalac.
    private async Task<MediaAsset> ValidateAndStoreAsync(
        MediaKind kind, string? caption, Stream content, long length, CancellationToken ct)
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

    // Čita prvih 64 bajta za prepoznavanje tipa i vraća tok na početak
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

    private async Task<MediaFile> OpenAsync(MediaAsset asset, CancellationToken ct)
    {
        var stream = await storage.OpenReadAsync(asset.StorageKey, ct)
            ?? throw new NotFoundException("Media", asset.Id);
        return new MediaFile(stream, asset.ContentType, asset.Id, asset.CreatedAt);
    }

    // Vlasnik i admin uvek; slike reditelja vide svi prijavljeni; slike glumaca i casting direktora samo reditelji i casting direktori
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

    // Portfolio glumca: on sam, admin, reditelji i casting direktori (isto kao spisak glumaca)
    private void EnsureCanViewPortfolio(Guid actorId)
    {
        if (currentUser.IsAdmin() || currentUser.Id == actorId)
            return;

        if (currentUser.Role is ParticipantRole.Director or ParticipantRole.CastingDirector)
            return;

        throw new ForbiddenException("You do not have access to this portfolio.");
    }

    private static MediaItemDto ToItemDto(MediaAsset a) =>
        new(a.Id, a.Kind, a.Caption, a.ContentType, a.SizeBytes, a.CreatedAt, $"/api/media/{a.Id}");

    // Fajl bez reda u bazi je samo smeće, ne greška: ne rušimo zahtev ako brisanje ne uspe
    private async Task TryDeleteFileAsync(string key)
    {
        try { await storage.DeleteAsync(key, CancellationToken.None); }
        catch { /* siroče na disku je bezopasno */ }
    }
}