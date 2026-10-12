using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Actors;
using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Actors;

public class ActorService(IAppDbContext db) : IActorService
{
    public Task<PagedResult<ActorSummaryDto>> ListAsync(ActorFilter filter, int page, int pageSize, CancellationToken ct)
        => QueryPageAsync(filter, page, pageSize, ct);

    public async Task<PagedResult<ActorSummaryDto>> ListMatchingAsync(Guid filmRoleId, int page, int pageSize, CancellationToken ct)
    {
        var role = await db.FilmRoles.AsNoTracking().FirstOrDefaultAsync(r => r.Id == filmRoleId, ct)
            ?? throw new NotFoundException(nameof(FilmRole), filmRoleId);

        var filter = new ActorFilter
        {
            Gender = role.Gender,
            Origin = role.Origin,
            AgeMin = role.AgeMin,
            AgeMax = role.AgeMax,
            HeightMin = role.HeightMin,
            HeightMax = role.HeightMax,
            WeightMin = role.WeightMin,
            WeightMax = role.WeightMax
        };

        return await QueryPageAsync(filter, page, pageSize, ct);
    }

    public async Task<ActorDto> GetAsync(Guid id, CancellationToken ct)
    {
        var actor = await db.Actors.AsNoTracking()
            .Include(a => a.Participant)
            .FirstOrDefaultAsync(a => a.ParticipantId == id, ct)
            ?? throw new NotFoundException(nameof(Actor), id);

        return actor.ToDto(Today());
    }

    public async Task<ActorDto> UpdateAsync(Guid id, UpdateActorRequest request, CancellationToken ct)
    {
        var actor = await db.Actors
            .Include(a => a.Participant)
            .FirstOrDefaultAsync(a => a.ParticipantId == id, ct)
            ?? throw new NotFoundException(nameof(Actor), id);

        actor.DateOfBirth = request.DateOfBirth;
        actor.Height = request.Height;
        actor.Weight = request.Weight;
        actor.Origin = request.Origin;
        actor.Gender = request.Gender;
        actor.Bio = request.Bio;

        actor.Links = (request.Links ?? [])
            .Select(l => new ActorLink(l.Label.Trim(), l.Url.Trim()))
            .ToList();
        actor.RoleInterests = (request.RoleInterests ?? [])
            .Select(i => i.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        await db.SaveChangesAsync(ct);
        return actor.ToDto(Today());
    }

    private async Task<PagedResult<ActorSummaryDto>> QueryPageAsync(
        ActorFilter filter, int page, int pageSize, CancellationToken ct)
    {
        var today = Today();
        var query = ApplyFilter(db.Actors.AsNoTracking(), filter, today);

        var total = await query.CountAsync(ct);
        var actors = await query
            .Include(a => a.Participant)
            .OrderBy(a => a.Participant.LastName)
            .ThenBy(a => a.Participant.FirstName)
            .ThenBy(a => a.ParticipantId)           
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<ActorSummaryDto>(
            actors.Select(a => a.ToSummaryDto(today)).ToList(), page, pageSize, total);
    }

    private static IQueryable<Actor> ApplyFilter(IQueryable<Actor> query, ActorFilter f, DateOnly today)
    {
        if (!string.IsNullOrWhiteSpace(f.Search))
        {
            var term = f.Search.Trim().ToLower();
            query = query.Where(a => (a.Participant.FirstName + " " + a.Participant.LastName).ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(f.Gender))
        {
            var gender = f.Gender.Trim().ToLower();
            query = query.Where(a => a.Gender != null && a.Gender.ToLower() == gender);
        }
        if (!string.IsNullOrWhiteSpace(f.Origin))
        {
            var origin = f.Origin.Trim().ToLower();
            query = query.Where(a => a.Origin != null && a.Origin.ToLower() == origin);
        }

        if (f.AgeMin is { } ageMin)
        {
            var latestBirth = today.AddYears(-ageMin);
            query = query.Where(a => a.DateOfBirth <= latestBirth);
        }
        if (f.AgeMax is { } ageMax)
        {
            var earliestBirth = today.AddYears(-(ageMax + 1));
            query = query.Where(a => a.DateOfBirth > earliestBirth);
        }

        if (f.HeightMin is { } heightMin) query = query.Where(a => a.Height >= heightMin);
        if (f.HeightMax is { } heightMax) query = query.Where(a => a.Height <= heightMax);
        if (f.WeightMin is { } weightMin) query = query.Where(a => a.Weight >= weightMin);
        if (f.WeightMax is { } weightMax) query = query.Where(a => a.Weight <= weightMax);

        return query;
    }

    private static DateOnly Today() => DateOnly.FromDateTime(DateTime.UtcNow);
}