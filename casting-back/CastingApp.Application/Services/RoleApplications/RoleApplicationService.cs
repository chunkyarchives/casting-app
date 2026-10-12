using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.RoleApplications;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.RoleApplications;

public class RoleApplicationService(IAppDbContext db) : IRoleApplicationService
{
    public async Task<IReadOnlyList<RoleApplicationDto>> ListAsync(
        Guid? filmRoleId, Guid? actorId, ApplicationStatus? status, CancellationToken ct)
    {
        var query = db.RoleApplications.AsNoTracking();
        if (filmRoleId is not null) query = query.Where(a => a.FilmRoleId == filmRoleId);
        if (actorId is not null) query = query.Where(a => a.ActorId == actorId);
        if (status is not null) query = query.Where(a => a.Status == status);

        return await query
            .OrderByDescending(a => a.CreatedAt)
            .ProjectToDto()
            .ToListAsync(ct);
    }

    public async Task<RoleApplicationDto> GetAsync(Guid id, CancellationToken ct) =>
        await db.RoleApplications.AsNoTracking()
            .Where(a => a.Id == id)
            .ProjectToDto()
            .FirstOrDefaultAsync(ct)
        ?? throw new NotFoundException("Application", id);

    public async Task<RoleApplicationDto> CreateAsync(
        Guid filmRoleId, CreateRoleApplicationRequest request, CancellationToken ct)
    {
        var role = await db.FilmRoles.AsNoTracking()
            .Include(r => r.Film)
            .FirstOrDefaultAsync(r => r.Id == filmRoleId, ct)
            ?? throw new NotFoundException(nameof(FilmRole), filmRoleId);

        if (role.Status != FilmRoleStatus.Open)
            throw new ConflictException("The role is already filled.");
        if (role.Film.Status != FilmStatus.Active)
            throw new ConflictException("The film is archived.");

        if (!await db.Actors.AnyAsync(a => a.ParticipantId == request.ActorId, ct))
            throw new NotFoundException(nameof(Actor), request.ActorId);

        if (request.ProposedById is { } castingDirectorId)
        {
            // Samo članovi ekipe reditelja ovog filma smeju da predlažu glumce
            // (kad uvedemo autorizaciju, ovo postaje 403)
            var isCrewMember = await db.CrewMemberships.AnyAsync(m =>
                m.CastingDirectorId == castingDirectorId && m.Crew.DirectorId == role.Film.DirectorId, ct);
            if (!isCrewMember)
                throw new ConflictException("The casting director is not a member of this film's crew.");
        }

        if (await db.RoleApplications.AnyAsync(a => a.FilmRoleId == filmRoleId && a.ActorId == request.ActorId, ct))
            throw new ConflictException("This actor is already proposed for this role.");

        var application = new RoleApplication
        {
            FilmRoleId = filmRoleId,
            ActorId = request.ActorId,
            ProposedById = request.ProposedById
        };
        db.RoleApplications.Add(application);

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            throw new ConflictException("This actor is already proposed for this role.");
        }

        return await GetAsync(application.Id, ct);
    }

    public async Task<RoleApplicationDto> AcceptAsync(Guid id, CancellationToken ct)
    {
        var application = await LoadProposedAsync(id, ct);

        if (application.FilmRole.Status != FilmRoleStatus.Open)
            throw new ConflictException("The role is already filled.");

        var now = DateTime.UtcNow;
        application.Status = ApplicationStatus.Accepted;
        application.DecidedAt = now;
        application.FilmRole.Status = FilmRoleStatus.Filled;   

        // Pravičnost: sve ostale prijave za ovu ulogu se odbijaju zajedno sa prihvatanjem
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

        await SaveDecisionAsync(ct);   // jedan SaveChanges == jedna transakcija
        return await GetAsync(id, ct);
    }

    public async Task<RoleApplicationDto> RejectAsync(Guid id, CancellationToken ct)
    {
        var application = await LoadProposedAsync(id, ct);

        application.Status = ApplicationStatus.Rejected;
        application.DecidedAt = DateTime.UtcNow;
        TouchRole(application.FilmRole);

        await SaveDecisionAsync(ct);
        return await GetAsync(id, ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var application = await LoadProposedAsync(id, ct);

        TouchRole(application.FilmRole);
        db.RoleApplications.Remove(application);

        await SaveDecisionAsync(ct);
    }

    // Učitava prijavu sa ulogom; odluka je moguća samo dok je prijava Proposed
    private async Task<RoleApplication> LoadProposedAsync(Guid id, CancellationToken ct)
    {
        var application = await db.RoleApplications
            .Include(a => a.FilmRole)
            .FirstOrDefaultAsync(a => a.Id == id, ct)
            ?? throw new NotFoundException("Application", id);

        if (application.Status != ApplicationStatus.Proposed)
            throw new ConflictException($"The application is already {application.Status}.");

        return application;
    }

    // Uloga je granica konzistentnosti za svoje prijave: svaka odluka menja njen RowVersion
    // AppDbContext ga uvećava, pa dve paralelne odluke nad istom ulogom ne mogu obe da uspeju.
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