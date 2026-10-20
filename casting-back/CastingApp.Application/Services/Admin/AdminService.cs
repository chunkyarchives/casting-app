using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Admin;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Admin;

public class AdminService(IAppDbContext db, ICurrentUser currentUser, IMediaStorage storage) : IAdminService
{
    public async Task<AdminStatsDto> GetStatsAsync(CancellationToken ct)
    {
        EnsureAdmin();
        var now = DateTimeOffset.UtcNow;

        var accounts = new AccountStats(
            Total: await db.Users.CountAsync(ct),
            Actors: await db.Users.CountAsync(u => u.Role == ParticipantRole.Actor, ct),
            Directors: await db.Users.CountAsync(u => u.Role == ParticipantRole.Director, ct),
            CastingDirectors: await db.Users.CountAsync(u => u.Role == ParticipantRole.CastingDirector, ct),
            Admins: await db.Users.CountAsync(u => u.Role == ParticipantRole.Admin, ct),
            Locked: await db.Users.CountAsync(u => u.LockoutEnabled && u.LockoutEnd != null && u.LockoutEnd > now, ct),
            IncompleteProfiles: await db.Users.CountAsync(u => u.Role != ParticipantRole.Admin && u.ProfileCompletedAt == null, ct));

        var films = new FilmStats(
            Total: await db.Films.CountAsync(ct),
            Active: await db.Films.CountAsync(f => f.Status == FilmStatus.Active, ct),
            Archived: await db.Films.CountAsync(f => f.Status == FilmStatus.Archived, ct),
            OpenRoles: await db.FilmRoles.CountAsync(r => r.Status == FilmRoleStatus.Open, ct),
            FilledRoles: await db.FilmRoles.CountAsync(r => r.Status == FilmRoleStatus.Filled, ct));

        var applications = new ApplicationStats(
            Total: await db.RoleApplications.CountAsync(ct),
            Proposed: await db.RoleApplications.CountAsync(a => a.Status == ApplicationStatus.Proposed, ct),
            Accepted: await db.RoleApplications.CountAsync(a => a.Status == ApplicationStatus.Accepted, ct),
            Rejected: await db.RoleApplications.CountAsync(a => a.Status == ApplicationStatus.Rejected, ct));

        var chat = new ChatStats(
            Conversations: await db.Conversations.CountAsync(ct),
            Messages: await db.Messages.CountAsync(ct));

        var media = new MediaStats(
            Files: await db.MediaAssets.CountAsync(ct),
            TotalBytes: await db.MediaAssets.SumAsync(m => m.SizeBytes, ct));

        return new AdminStatsDto(accounts, films, applications, chat, media);
    }

    public async Task<IReadOnlyList<TimelinePointDto>> GetTimelineAsync(int days, CancellationToken ct)
    {
        EnsureAdmin();
        days = Math.Clamp(days, 1, 90);

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var firstDay = today.AddDays(-(days - 1));
        var since = firstDay.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);

        var registrations = PerDay(await db.Users.AsNoTracking()
            .Where(u => u.CreatedAt >= since).Select(u => u.CreatedAt).ToListAsync(ct));
        var films = PerDay(await db.Films.AsNoTracking()
            .Where(f => f.CreatedAt >= since).Select(f => f.CreatedAt).ToListAsync(ct));
        var messages = PerDay(await db.Messages.AsNoTracking()
            .Where(m => m.SentAt >= since).Select(m => m.SentAt).ToListAsync(ct));

        var points = new List<TimelinePointDto>(days);
        for (var i = 0; i < days; i++)
        {
            var day = firstDay.AddDays(i);
            points.Add(new TimelinePointDto(
                day,
                registrations.GetValueOrDefault(day),
                films.GetValueOrDefault(day),
                messages.GetValueOrDefault(day)));
        }

        return points;
    }

    public async Task<PagedResult<AdminAccountDto>> ListAccountsAsync(
        string? search, ParticipantRole? role, bool? locked, int page, int pageSize, CancellationToken ct)
    {
        EnsureAdmin();
        var now = DateTimeOffset.UtcNow;

        var query = db.Users.AsNoTracking();

        if (role is { } r)
            query = query.Where(u => u.Role == r);

        if (locked is true)
            query = query.Where(u => u.LockoutEnabled && u.LockoutEnd != null && u.LockoutEnd > now);
        else if (locked is false)
            query = query.Where(u => !u.LockoutEnabled || u.LockoutEnd == null || u.LockoutEnd <= now);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(u =>
                (u.FirstName + " " + u.LastName).ToLower().Contains(term)
                || (u.Email != null && u.Email.ToLower().Contains(term)));
        }

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(u => u.LastName)
            .ThenBy(u => u.FirstName)
            .ThenBy(u => u.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new AdminAccountDto(
                u.Id,
                u.Email ?? string.Empty,
                u.FirstName,
                u.LastName,
                u.Role,
                u.Role == ParticipantRole.Admin || u.ProfileCompletedAt != null,
                u.LockoutEnabled && u.LockoutEnd != null && u.LockoutEnd > now,
                u.CreatedAt))
            .ToListAsync(ct);

        return new PagedResult<AdminAccountDto>(items, page, pageSize, total);
    }

    public async Task<AdminAccountDetailDto> GetAccountAsync(Guid id, CancellationToken ct)
    {
        EnsureAdmin();
        var now = DateTimeOffset.UtcNow;
        var nowUtc = now.UtcDateTime;

        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, ct)
            ?? throw new NotFoundException(nameof(Participant), id);

        var locked = user.LockoutEnabled && user.LockoutEnd is { } end && end > now;
        DateTimeOffset? lockedUntil = locked && user.LockoutEnd != DateTimeOffset.MaxValue ? user.LockoutEnd : null;

        string? lockReason = null;
        if (locked)
        {
            lockReason = await db.AdminAudit.AsNoTracking()
                .Where(a => a.TargetId == id && a.Action == AdminAction.LockAccount)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => a.Reason)
                .FirstOrDefaultAsync(ct);
        }

        var lastActive = await db.RefreshTokens.AsNoTracking()
            .Where(t => t.ParticipantId == id)
            .MaxAsync(t => (DateTime?)t.CreatedAt, ct);

        var activeSessions = await db.RefreshTokens.AsNoTracking()
            .CountAsync(t => t.ParticipantId == id && t.RevokedAt == null && t.ExpiresAt > nowUtc, ct);

        var films = await db.Films.CountAsync(f => f.DirectorId == id, ct);
        var applications = await db.RoleApplications.CountAsync(a => a.ActorId == id || a.ProposedById == id, ct);
        var conversations = await db.Conversations.CountAsync(c => c.ActorId == id || c.DirectorId == id, ct);
        var mediaFiles = await db.MediaAssets.CountAsync(m => m.OwnerId == id, ct);
        var mediaBytes = await db.MediaAssets.Where(m => m.OwnerId == id).SumAsync(m => m.SizeBytes, ct);

        return new AdminAccountDetailDto(
            user.Id,
            user.Email ?? string.Empty,
            user.FirstName,
            user.LastName,
            user.Role,
            user.Role == ParticipantRole.Admin || user.ProfileCompletedAt is not null,
            user.ProfileCompletedAt,
            user.CreatedAt,
            locked,
            lockedUntil,
            lockReason,
            lastActive,
            activeSessions,
            films,
            applications,
            conversations,
            mediaFiles,
            mediaBytes);
    }

    public async Task<AdminAccountDto> LockAccountAsync(Guid id, LockAccountRequest request, CancellationToken ct)
    {
        EnsureAdmin();
        var user = await LoadManageableAsync(id, ct);

        var lockEnd = DateTimeOffset.MaxValue;   
        var note = " (permanent)";
        if (request.Until is { } until)
        {
            var untilUtc = until.Kind == DateTimeKind.Local
                ? until.ToUniversalTime()
                : DateTime.SpecifyKind(until, DateTimeKind.Utc);

            if (untilUtc <= DateTime.UtcNow)
                throw new BadRequestException("Until must be in the future.");

            lockEnd = new DateTimeOffset(untilUtc);
            note = $" (until {untilUtc:yyyy-MM-dd HH:mm} UTC)";
        }

        user.LockoutEnabled = true;
        user.LockoutEnd = lockEnd;

        await RevokeSessionsAsync(id, ct);
        await AddAuditAsync(AdminAction.LockAccount, "Account", id, LabelOf(user), request.Reason.Trim() + note, ct);

        await db.SaveChangesAsync(ct);
        return ToAccountDto(user, DateTimeOffset.UtcNow);
    }

    public async Task<AdminAccountDto> UnlockAccountAsync(Guid id, string? reason, CancellationToken ct)
    {
        EnsureAdmin();
        var user = await LoadManageableAsync(id, ct);

        user.LockoutEnd = null;
        user.AccessFailedCount = 0;

        await AddAuditAsync(AdminAction.UnlockAccount, "Account", id, LabelOf(user), reason, ct);

        await db.SaveChangesAsync(ct);
        return ToAccountDto(user, DateTimeOffset.UtcNow);
    }

    public async Task<ForceLogoutResult> ForceLogoutAsync(Guid id, string? reason, CancellationToken ct)
    {
        EnsureAdmin();
        var user = await LoadManageableAsync(id, ct);

        var ended = await RevokeSessionsAsync(id, ct);
        await AddAuditAsync(AdminAction.ForceLogout, "Account", id, LabelOf(user), reason, ct);

        await db.SaveChangesAsync(ct);
        return new ForceLogoutResult(ended);
    }

    public async Task DeleteAccountAsync(Guid id, string reason, CancellationToken ct)
    {
        EnsureAdmin();
        var user = await LoadManageableAsync(id, ct);
        var label = LabelOf(user);

        if (user.Role == ParticipantRole.Director)
        {
            var films = await db.Films.CountAsync(f => f.DirectorId == id, ct);
            if (films > 0)
                throw new ConflictException($"This director still has {films} film(s). Delete the films first.");
        }

        var storageKeys = await db.MediaAssets
            .Where(m => m.OwnerId == id)
            .Select(m => m.StorageKey)
            .ToListAsync(ct);

        user.ProfilePictureId = null;
        if (user.Role == ParticipantRole.Director)
            db.Crews.RemoveRange(await db.Crews.Where(c => c.DirectorId == id).ToListAsync(ct));
        await db.SaveChangesAsync(ct);

        await AddAuditAsync(AdminAction.DeleteAccount, "Account", id, label, reason, ct);
        db.Users.Remove(user);
        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            throw new ConflictException("The account still has data that blocks its deletion.");
        }

        foreach (var key in storageKeys)
            await TryDeleteFileAsync(key);
    }

    public async Task<PagedResult<AdminFilmDto>> ListFilmsAsync(
        string? search, FilmStatus? status, int page, int pageSize, CancellationToken ct)
    {
        EnsureAdmin();

        var query = db.Films.AsNoTracking();

        if (status is { } s)
            query = query.Where(f => f.Status == s);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(f =>
                f.Title.ToLower().Contains(term)
                || (f.Director.Participant.FirstName + " " + f.Director.Participant.LastName).ToLower().Contains(term));
        }

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(f => f.CreatedAt)
            .ThenBy(f => f.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(f => new AdminFilmDto(
                f.Id,
                f.Title,
                f.Status,
                f.DirectorId,
                f.Director.Participant.FirstName + " " + f.Director.Participant.LastName,
                f.Roles.Count,
                f.CreatedAt))
            .ToListAsync(ct);

        return new PagedResult<AdminFilmDto>(items, page, pageSize, total);
    }

    public async Task DeleteFilmAsync(Guid id, string reason, CancellationToken ct)
    {
        EnsureAdmin();

        var film = await db.Films.FirstOrDefaultAsync(f => f.Id == id, ct)
            ?? throw new NotFoundException(nameof(Film), id);

        await AddAuditAsync(AdminAction.DeleteFilm, "Film", id, film.Title, reason, ct);
        db.Films.Remove(film);
        await db.SaveChangesAsync(ct);
    }

    public async Task<PagedResult<AdminConversationDto>> ListConversationsAsync(
        Guid? participantId, int page, int pageSize, CancellationToken ct)
    {
        EnsureAdmin();

        var query = db.Conversations.AsNoTracking();

        if (participantId is { } pid)
            query = query.Where(c => c.ActorId == pid || c.DirectorId == pid);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(c => c.Actor.Participant.LastName)
            .ThenBy(c => c.Director.Participant.LastName)
            .ThenBy(c => c.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new AdminConversationDto(
                c.Id,
                c.ActorId,
                c.Actor.Participant.FirstName + " " + c.Actor.Participant.LastName,
                c.DirectorId,
                c.Director.Participant.FirstName + " " + c.Director.Participant.LastName,
                c.Messages.Count))
            .ToListAsync(ct);

        return new PagedResult<AdminConversationDto>(items, page, pageSize, total);
    }

    public async Task DeleteConversationAsync(Guid id, string reason, CancellationToken ct)
    {
        EnsureAdmin();

        var conversation = await db.Conversations.FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException(nameof(Conversation), id);

        var label = await db.Conversations.AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => c.Actor.Participant.FirstName + " " + c.Actor.Participant.LastName
                         + " / " + c.Director.Participant.FirstName + " " + c.Director.Participant.LastName)
            .FirstAsync(ct);

        await AddAuditAsync(AdminAction.DeleteConversation, "Conversation", id, label, reason, ct);

        db.Conversations.Remove(conversation);
        await db.SaveChangesAsync(ct);
    }
    public async Task<PagedResult<AuditEntryDto>> ListAuditAsync(
        AdminAction? action, Guid? targetId, int page, int pageSize, CancellationToken ct)
    {
        EnsureAdmin();

        var query = db.AdminAudit.AsNoTracking();

        if (action is { } a)
            query = query.Where(x => x.Action == a);
        if (targetId is { } t)
            query = query.Where(x => x.TargetId == t);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .ThenBy(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new AuditEntryDto(
                x.Id, x.AdminId, x.AdminEmail, x.Action, x.TargetType, x.TargetId, x.TargetLabel, x.Reason, x.CreatedAt))
            .ToListAsync(ct);

        return new PagedResult<AuditEntryDto>(items, page, pageSize, total);
    }

    private void EnsureAdmin()
    {
        if (!currentUser.IsAdmin())
            throw new ForbiddenException("Only administrators can do this.");
    }

    private async Task<Participant> LoadManageableAsync(Guid id, CancellationToken ct)
    {
        if (id == currentUser.Id)
            throw new ConflictException("You cannot lock or delete your own account.");

        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id, ct)
            ?? throw new NotFoundException(nameof(Participant), id);

        if (user.Role == ParticipantRole.Admin)
            throw new ConflictException("Admin accounts cannot be locked or deleted through the API.");

        return user;
    }

    private async Task<int> RevokeSessionsAsync(Guid participantId, CancellationToken ct)
    {
        var revokedAt = DateTime.UtcNow;
        var tokens = await db.RefreshTokens
            .Where(t => t.ParticipantId == participantId && t.RevokedAt == null)
            .ToListAsync(ct);

        foreach (var token in tokens)
            token.RevokedAt = revokedAt;

        return tokens.Count;
    }

    private async Task AddAuditAsync(
        AdminAction action, string targetType, Guid targetId, string targetLabel, string? reason, CancellationToken ct)
    {
        var adminId = currentUser.Id;
        var adminEmail = await db.Users.AsNoTracking()
            .Where(u => u.Id == adminId)
            .Select(u => u.Email)
            .FirstOrDefaultAsync(ct);

        db.AdminAudit.Add(new AdminAuditEntry
        {
            AdminId = adminId,
            AdminEmail = adminEmail ?? adminId.ToString(),
            Action = action,
            TargetType = targetType,
            TargetId = targetId,
            TargetLabel = Truncate(targetLabel, 300),
            Reason = string.IsNullOrWhiteSpace(reason) ? null : Truncate(reason.Trim(), 600),
            CreatedAt = DateTime.UtcNow
        });
    }

    private static string LabelOf(Participant user) => user.Email ?? user.Id.ToString();

    private static string Truncate(string value, int max) => value.Length <= max ? value : value[..max];

    private static AdminAccountDto ToAccountDto(Participant u, DateTimeOffset now) => new(
        u.Id,
        u.Email ?? string.Empty,
        u.FirstName,
        u.LastName,
        u.Role,
        u.Role == ParticipantRole.Admin || u.ProfileCompletedAt is not null,
        u.LockoutEnabled && u.LockoutEnd is { } end && end > now,
        u.CreatedAt);

    private static Dictionary<DateOnly, int> PerDay(IEnumerable<DateTime> times) =>
        times
            .GroupBy(t => DateOnly.FromDateTime(t.Kind == DateTimeKind.Local ? t.ToUniversalTime() : t))
            .ToDictionary(g => g.Key, g => g.Count());

    private static Dictionary<DateOnly, int> PerDay(IEnumerable<DateTimeOffset> times) =>
        times
            .GroupBy(t => DateOnly.FromDateTime(t.UtcDateTime))
            .ToDictionary(g => g.Key, g => g.Count());

    private async Task TryDeleteFileAsync(string key)
    {
        try { await storage.DeleteAsync(key, CancellationToken.None); }
        catch {}
    }
}