using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.RoleApplications;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.RoleApplications;

public class RoleApplicationService(IAppDbContext db, ICurrentUser currentUser, IApplicationNotifier notifier) : IRoleApplicationService
{
    public async Task<IReadOnlyList<RoleApplicationDto>> ListAsync(
        Guid? filmRoleId, Guid? actorId, ApplicationStatus? status, CancellationToken ct)
    {
        var query = ScopeToCurrentUser(db.RoleApplications.AsNoTracking());
        if (filmRoleId is not null) query = query.Where(a => a.FilmRoleId == filmRoleId);
        if (actorId is not null) query = query.Where(a => a.ActorId == actorId);
        if (status is not null) query = query.Where(a => a.Status == status);

        return await query
            .OrderByDescending(a => a.CreatedAt)
            .ProjectToDto()
            .ToListAsync(ct);
    }

    public async Task<RoleApplicationDto> GetAsync(Guid id, CancellationToken ct) =>
        await ScopeToCurrentUser(db.RoleApplications.AsNoTracking())
            .Where(a => a.Id == id)
            .ProjectToDto()
            .FirstOrDefaultAsync(ct)
        ?? throw new NotFoundException("Application", id);

    public async Task<IReadOnlyList<RoleApplicationDto>> ListPendingAsync(CancellationToken ct)
    {
        var directorId = currentUser.Id;

        return await db.RoleApplications.AsNoTracking()
            .Where(a => a.Status == ApplicationStatus.Proposed
                        && a.FilmRole.Film.DirectorId == directorId
                        && a.FilmRole.Film.Status == FilmStatus.Active)
            .OrderBy(a => a.Position)
            .ThenBy(a => a.CreatedAt)
            .ProjectToDto()
            .ToListAsync(ct);
    }

    public async Task ReorderPendingAsync(IReadOnlyList<Guid> applicationIds, CancellationToken ct)
    {
        if (applicationIds.Distinct().Count() != applicationIds.Count)
            throw new BadRequestException("Each application can appear only once.");

        var directorId = currentUser.Id;
        var pending = await db.RoleApplications
            .Where(a => applicationIds.Contains(a.Id)
                        && a.Status == ApplicationStatus.Proposed
                        && a.FilmRole.Film.DirectorId == directorId)
            .ToListAsync(ct);

        var positions = applicationIds.Select((id, index) => (id, index)).ToDictionary(p => p.id, p => p.index + 1);
        foreach (var application in pending)
            application.Position = positions[application.Id];

        await db.SaveChangesAsync(ct);
    }

    public async Task<RoleApplicationDto> CreateAsync(
        Guid filmRoleId, CreateRoleApplicationRequest request, CancellationToken ct)
    {
        Guid actorId;
        Guid? proposedById;
        switch (currentUser.Role)
        {
            case ParticipantRole.Actor:
                if (request.ActorId is { } other && other != currentUser.Id)
                    throw new ForbiddenException("Actors can only apply for themselves.");
                actorId = currentUser.Id;
                proposedById = null;
                break;

            case ParticipantRole.CastingDirector:
                actorId = request.ActorId
                    ?? throw new BadRequestException("ActorId is required when a casting director proposes an actor.");
                proposedById = currentUser.Id;
                break;

            default:
                throw new ForbiddenException("Only actors and casting directors can add applications.");
        }

        var role = await db.FilmRoles.AsNoTracking()
            .Include(r => r.Film)
            .FirstOrDefaultAsync(r => r.Id == filmRoleId, ct)
            ?? throw new NotFoundException(nameof(FilmRole), filmRoleId);

        if (role.Status != FilmRoleStatus.Open)
            throw new ConflictException("The role is already filled.");
        if (role.Film.Status != FilmStatus.Active)
            throw new ConflictException("The film is archived.");

        if (!await db.Actors.AnyAsync(a => a.ParticipantId == actorId, ct))
            throw new NotFoundException(nameof(Actor), actorId);

        if (proposedById is { } castingDirectorId)
        {
            // Samo clanovi ekipe rezisera ovog filma smeju da predlazu glumce
            var isCrewMember = await db.CrewMemberships.AnyAsync(m =>
                m.CastingDirectorId == castingDirectorId && m.Crew.DirectorId == role.Film.DirectorId, ct);
            if (!isCrewMember)
                throw new ForbiddenException("The casting director is not a member of this film's crew.");
        }

        var position = await NextPositionAsync(role.Film.DirectorId, ct);
        var application = await db.RoleApplications
            .FirstOrDefaultAsync(a => a.FilmRoleId == filmRoleId && a.ActorId == actorId, ct);

        if (application is null)
        {
            application = new RoleApplication
            {
                FilmRoleId = filmRoleId,
                ActorId = actorId,
                ProposedById = proposedById,
                Position = position
            };
            db.RoleApplications.Add(application);
        }
        else if (application.Status == ApplicationStatus.Rejected)
        {
            application.Status = ApplicationStatus.Proposed;
            application.ProposedById = proposedById;
            application.CreatedAt = DateTime.UtcNow;
            application.DecidedAt = null;
            application.Position = position;
        }
        else
        {
            throw new ConflictException("This actor is already proposed for this role.");
        }

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            // Unique indeks uq_application: isti glumac je u medjuvremenu predlozen paralelnim zahtevom
            throw new ConflictException("This actor is already proposed for this role.");
        }

        var created = await GetAsync(application.Id, ct);
        await notifier.ApplicationCreatedAsync(created, role.Film.DirectorId, ct);
        return created;
    }

    public async Task<RoleApplicationDto> AcceptAsync(Guid id, CancellationToken ct)
    {
        var application = await LoadAsync(id, ct);
        currentUser.EnsureOwnerOrAdmin(application.FilmRole.Film.DirectorId);   // odlucuje reziser filma
        EnsureProposed(application);

        if (application.FilmRole.Status != FilmRoleStatus.Open)
            throw new ConflictException("The role is already filled.");

        var now = DateTime.UtcNow;
        application.Status = ApplicationStatus.Accepted;
        application.DecidedAt = now;
        application.FilmRole.Status = FilmRoleStatus.Filled;   // AppDbContext uvecava RowVersion uloge

        // Pravicnost: sve ostale prijave za ovu ulogu se odbijaju zajedno sa prihvatanjem
        var competitors = await db.RoleApplications
            .Where(a => a.FilmRoleId == application.FilmRoleId
                        && a.Id != id
                        && a.Status == ApplicationStatus.Proposed)
            .ToListAsync(ct);

        foreach (var competitor in competitors)
        {
            competitor.Status = ApplicationStatus.Rejected;
            competitor.DecidedAt = now;
        }

        await SaveDecisionAsync(ct);   // jedan SaveChanges = jedna transakcija

        var decidedIds = competitors.Select(c => c.Id).Append(id).ToList();
        var decided = await db.RoleApplications.AsNoTracking()
            .Where(a => decidedIds.Contains(a.Id))
            .ProjectToDto()
            .ToListAsync(ct);

        foreach (var item in decided)
            await notifier.ApplicationDecidedAsync(item, ct);

        return decided.First(a => a.Id == id);
    }

    public async Task<RoleApplicationDto> RejectAsync(Guid id, CancellationToken ct)
    {
        var application = await LoadAsync(id, ct);
        currentUser.EnsureOwnerOrAdmin(application.FilmRole.Film.DirectorId);
        EnsureProposed(application);

        application.Status = ApplicationStatus.Rejected;
        application.DecidedAt = DateTime.UtcNow;
        TouchRole(application.FilmRole);

        await SaveDecisionAsync(ct);

        var rejected = await GetAsync(id, ct);
        await notifier.ApplicationDecidedAsync(rejected, ct);
        return rejected;
    }

    // Povlacenje prijave: glumac, casting director koji ga je predlozio, ili admin
    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var application = await LoadAsync(id, ct);

        var me = currentUser.Id;
        if (!currentUser.IsAdmin() && application.ActorId != me && application.ProposedById != me)
            throw new ForbiddenException("Only the actor or the casting director who proposed them can withdraw this application.");

        EnsureProposed(application);

        TouchRole(application.FilmRole);
        db.RoleApplications.Remove(application);

        await SaveDecisionAsync(ct);
    }

    // Sta ko sme da vidi: glumac svoje, reziser prijave na svojim filmovima, casting director prijave na filmovima rezisera cijoj ekipi pripada, admin sve
    private IQueryable<RoleApplication> ScopeToCurrentUser(IQueryable<RoleApplication> query)
    {
        var me = currentUser.Id;
        return currentUser.Role switch
        {
            ParticipantRole.Admin => query,
            ParticipantRole.Actor => query.Where(a => a.ActorId == me),
            ParticipantRole.Director => query.Where(a => a.FilmRole.Film.DirectorId == me),
            ParticipantRole.CastingDirector => query.Where(a =>
                db.CrewMemberships.Any(m =>
                    m.CastingDirectorId == me && m.Crew.DirectorId == a.FilmRole.Film.DirectorId)),
            _ => query.Where(a => false)
        };
    }

    // Ucitava prijavu sa ulogom i filmom (treba nam DirectorId filma za proveru vlasništva)
    private async Task<RoleApplication> LoadAsync(Guid id, CancellationToken ct) =>
        await db.RoleApplications
            .Include(a => a.FilmRole).ThenInclude(r => r.Film)
            .FirstOrDefaultAsync(a => a.Id == id, ct)
        ?? throw new NotFoundException("Application", id);

    private async Task<int> NextPositionAsync(Guid directorId, CancellationToken ct)
    {
        var last = await db.RoleApplications
            .Where(a => a.Status == ApplicationStatus.Proposed && a.FilmRole.Film.DirectorId == directorId)
            .MaxAsync(a => (int?)a.Position, ct);
        return (last ?? 0) + 1;
    }

    private static void EnsureProposed(RoleApplication application)
    {
        if (application.Status != ApplicationStatus.Proposed)
            throw new ConflictException($"The application is already {application.Status}.");
    }

    // Uloga je granica konzistentnosti za svoje prijave: svaka odluka menja njen RowVersion
    // AppDbContext ga uvecava, pa dve paralelne odluke nad istom ulogom ne mogu obe da uspeju.
    private void TouchRole(FilmRole role) =>
        db.Entry(role).Property(r => r.RowVersion).IsModified = true;

    private async Task SaveDecisionAsync(CancellationToken ct)
    {
        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            throw new ConflictException(
                "Another decision for this role was made at the same time. Reload and try again.");
        }
    }
}