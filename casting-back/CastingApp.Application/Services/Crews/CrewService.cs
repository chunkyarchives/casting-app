using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Crews;
using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Crews;

public class CrewService(IAppDbContext db, ICurrentUser currentUser) : ICrewService
{
    public async Task<IReadOnlyList<CrewSummaryDto>> ListAsync(Guid? directorId, CancellationToken ct)
    {
        var query = db.Crews.AsNoTracking();
        if (directorId is not null)
            query = query.Where(c => c.DirectorId == directorId);

        return await query
            .OrderBy(c => c.ProductionName)
            .Select(c => new CrewSummaryDto(c.Id, c.DirectorId, c.ProductionName, c.Memberships.Count, c.CreatedAt))
            .ToListAsync(ct);
    }

    public async Task<CrewDto> GetAsync(Guid id, CancellationToken ct)
    {
        var crew = await WithDetails(db.Crews.AsNoTracking())
            .FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException(nameof(Crew), id);

        // Kod vide reditelj ekipe, njeni članovi i admin
        var includeCode = currentUser.IsAdmin()
            || currentUser.Id == crew.DirectorId
            || crew.Memberships.Any(m => m.CastingDirectorId == currentUser.Id);

        return crew.ToDto(includeCode);
    }

    public async Task<IReadOnlyList<CrewDto>> ListMineAsync(CancellationToken ct)
    {
        var me = currentUser.Id;
        var crews = await WithDetails(db.Crews.AsNoTracking())
            .Where(c => c.DirectorId == me || c.Memberships.Any(m => m.CastingDirectorId == me))
            .ToListAsync(ct);

        return crews
            .OrderByDescending(c => c.Memberships.FirstOrDefault(m => m.CastingDirectorId == me)?.JoinedAt ?? c.CreatedAt)
            .Select(c => c.ToDto(includeCode: true))
            .ToList();
    }

    public async Task<CrewDto> CreateAsync(CreateCrewRequest request, CancellationToken ct)
    {
        var directorId = currentUser.Id;
        if (!await db.Directors.AnyAsync(d => d.ParticipantId == directorId, ct))
            throw new NotFoundException(nameof(Director), directorId);

        if (await db.Crews.AnyAsync(c => c.DirectorId == directorId, ct))
            throw new ConflictException("This director already has a crew.");

        var crew = new Crew
        {
            DirectorId = directorId,
            ProductionName = request.ProductionName.Trim(),
            ProductionCode = await ProductionCodes.GenerateUniqueAsync(db, ct)
        };
        db.Crews.Add(crew);

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            throw new ConflictException("The crew could not be created. Try again.");
        }

        return await GetAsync(crew.Id, ct);
    }

    public async Task<CrewDto> UpdateAsync(Guid id, UpdateCrewRequest request, CancellationToken ct)
    {
        var crew = await db.Crews.FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException(nameof(Crew), id);

        currentUser.EnsureOwnerOrAdmin(crew.DirectorId);

        crew.ProductionName = request.ProductionName.Trim();
        await db.SaveChangesAsync(ct);
        return await GetAsync(id, ct);
    }

    public async Task<CrewDto> RegenerateCodeAsync(Guid id, CancellationToken ct)
    {
        var crew = await db.Crews.FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException(nameof(Crew), id);

        currentUser.EnsureOwnerOrAdmin(crew.DirectorId);

        crew.ProductionCode = await ProductionCodes.GenerateUniqueAsync(db, ct);
        await db.SaveChangesAsync(ct);
        return await GetAsync(id, ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var crew = await db.Crews.FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException(nameof(Crew), id);

        currentUser.EnsureOwnerOrAdmin(crew.DirectorId);

        db.Crews.Remove(crew);
        await db.SaveChangesAsync(ct);
    }

    public async Task<CrewDto> JoinAsync(JoinCrewRequest request, CancellationToken ct)
    {
        var castingDirectorId = currentUser.Id;
        var code = request.ProductionCode.Trim().ToUpperInvariant();

        var crew = await db.Crews.AsNoTracking().FirstOrDefaultAsync(c => c.ProductionCode == code, ct)
            ?? throw new NotFoundException(nameof(Crew), code);

        if (!await db.CastingDirectors.AnyAsync(c => c.ParticipantId == castingDirectorId, ct))
            throw new NotFoundException(nameof(CastingDirector), castingDirectorId);

        if (await db.CrewMemberships.AnyAsync(
                m => m.CrewId == crew.Id && m.CastingDirectorId == castingDirectorId, ct))
            throw new ConflictException("The casting director is already a member of this crew.");

        db.CrewMemberships.Add(new CrewMembership
        {
            CrewId = crew.Id,
            CastingDirectorId = castingDirectorId
        });

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            throw new ConflictException("The casting director is already a member of this crew.");
        }

        return await GetAsync(crew.Id, ct);
    }

    public async Task RemoveMemberAsync(Guid crewId, Guid castingDirectorId, CancellationToken ct)
    {
        var crew = await db.Crews.AsNoTracking().FirstOrDefaultAsync(c => c.Id == crewId, ct)
            ?? throw new NotFoundException(nameof(Crew), crewId);

        if (!currentUser.IsAdmin() && currentUser.Id != crew.DirectorId && currentUser.Id != castingDirectorId)
            throw new ForbiddenException("Only the crew's director or the member can remove this membership.");

        var membership = await db.CrewMemberships
            .FirstOrDefaultAsync(m => m.CrewId == crewId && m.CastingDirectorId == castingDirectorId, ct)
            ?? throw new NotFoundException("Crew member", castingDirectorId);

        db.CrewMemberships.Remove(membership);
        await db.SaveChangesAsync(ct);
    }

    private static IQueryable<Crew> WithDetails(IQueryable<Crew> query) => query
        .Include(c => c.Director).ThenInclude(d => d.Participant)
        .Include(c => c.Memberships).ThenInclude(m => m.CastingDirector).ThenInclude(cd => cd.Participant);
}