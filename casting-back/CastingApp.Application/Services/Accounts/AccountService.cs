using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Accounts;
using CastingApp.Application.DTOs.Auth;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Accounts;

public class AccountService(
    UserManager<Participant> users,
    IAppDbContext db,
    ICurrentUser currentUser,
    ISessionService sessions,
    IMediaStorage storage) : IAccountService
{
    public async Task<MeDto> UpdateVisibilityAsync(UpdateVisibilityRequest request, CancellationToken ct)
    {
        var user = await LoadAsync(ct);

        user.IsProfilePublic = request.IsProfilePublic;
        await SaveAsync(user);

        return user.ToMeDto();
    }

    public async Task DeactivateAsync(DeactivateAccountRequest request, CancellationToken ct)
    {
        var user = await LoadAsync(ct);
        await EnsurePasswordAsync(user, request.Password);

        user.DeactivatedUntil = request.Until!.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        await SaveAsync(user);

        await sessions.EndAllAsync(user.Id, ct);
    }

    public async Task DeleteAsync(DeleteAccountRequest request, CancellationToken ct)
    {
        var user = await LoadAsync(ct);
        if (user.Role == ParticipantRole.Admin)
            throw new ConflictException("Admin accounts cannot be deleted here.");

        await EnsurePasswordAsync(user, request.Password);

        if (user.Role == ParticipantRole.Director)
        {
            var films = await db.Films.CountAsync(f => f.DirectorId == user.Id, ct);
            if (films > 0)
                throw new ConflictException($"You still have {films} film(s). Delete them first.");
        }

        var storageKeys = await db.MediaAssets
            .Where(m => m.OwnerId == user.Id)
            .Select(m => m.StorageKey)
            .ToListAsync(ct);

        user.ProfilePictureId = null;
        if (user.Role == ParticipantRole.Director)
            db.Crews.RemoveRange(await db.Crews.Where(c => c.DirectorId == user.Id).ToListAsync(ct));
        await db.SaveChangesAsync(ct);

        db.Users.Remove(user);
        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            throw new ConflictException("Your account still has data that blocks its deletion.");
        }

        foreach (var key in storageKeys)
        {
            try { await storage.DeleteAsync(key, CancellationToken.None); }
            catch { }
        }
    }

    private async Task<Participant> LoadAsync(CancellationToken ct)
    {
        var id = currentUser.Id;

        return await users.Users
            .Include(u => u.Actor)
            .Include(u => u.Director)
            .Include(u => u.CastingDirector)
            .FirstOrDefaultAsync(u => u.Id == id, ct)
            ?? throw new UnauthorizedException("The account no longer exists.");
    }

    private async Task EnsurePasswordAsync(Participant user, string password)
    {
        if (!await users.CheckPasswordAsync(user, password))
            throw new BadRequestException("The password is not correct.");
    }

    private async Task SaveAsync(Participant user)
    {
        var result = await users.UpdateAsync(user);
        if (!result.Succeeded)
            throw new BadRequestException(string.Join(" ", result.Errors.Select(e => e.Description)));
    }
}