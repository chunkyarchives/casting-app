using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.CastingDirectors;
using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.CastingDirectors;

public class CastingDirectorService(IAppDbContext db) : ICastingDirectorService
{
    public async Task<PagedResult<CastingDirectorSummaryDto>> ListAsync(string? search, int page, int pageSize, CancellationToken ct)
    {
        var query = db.CastingDirectors.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(c => (c.Participant.FirstName + " " + c.Participant.LastName).ToLower().Contains(term));
        }

        var total = await query.CountAsync(ct);
        var items = await query
            .Include(c => c.Participant)
            .OrderBy(c => c.Participant.LastName)
            .ThenBy(c => c.Participant.FirstName)
            .ThenBy(c => c.ParticipantId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<CastingDirectorSummaryDto>(items.Select(c => c.ToSummaryDto()).ToList(), page, pageSize, total);
    }

    public async Task<CastingDirectorDto> GetAsync(Guid id, CancellationToken ct)
    {
        var castingDirector = await db.CastingDirectors.AsNoTracking()
            .Include(c => c.Participant)
            .FirstOrDefaultAsync(c => c.ParticipantId == id, ct)
            ?? throw new NotFoundException(nameof(CastingDirector), id);

        return castingDirector.ToDto(DateOnly.FromDateTime(DateTime.UtcNow));
    }

    public async Task<CastingDirectorDto> UpdateAsync(Guid id, UpdateCastingDirectorRequest request, CancellationToken ct)
    {
        var castingDirector = await db.CastingDirectors
            .Include(c => c.Participant)
            .FirstOrDefaultAsync(c => c.ParticipantId == id, ct)
            ?? throw new NotFoundException(nameof(CastingDirector), id);

        castingDirector.DateOfBirth = request.DateOfBirth;
        castingDirector.Gender = request.Gender;

        await db.SaveChangesAsync(ct);
        return castingDirector.ToDto(DateOnly.FromDateTime(DateTime.UtcNow));
    }
}