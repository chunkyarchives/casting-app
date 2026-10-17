using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Directors;
using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using CastingApp.Application.Services.Profiles;

namespace CastingApp.Application.Services.Directors;

public class DirectorService(IAppDbContext db, ICurrentUser currentUser, IProfileCompletionService profileCompletion) : IDirectorService
{
    public async Task<PagedResult<DirectorSummaryDto>> ListAsync(string? search, int page, int pageSize, CancellationToken ct)
    {
        var query = db.Directors.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(d => (d.Participant.FirstName + " " + d.Participant.LastName).ToLower().Contains(term));
        }

        var total = await query.CountAsync(ct);
        var directors = await query
            .Include(d => d.Participant)
            .OrderBy(d => d.Participant.LastName)
            .ThenBy(d => d.Participant.FirstName)
            .ThenBy(d => d.ParticipantId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<DirectorSummaryDto>(directors.Select(d => d.ToSummaryDto()).ToList(), page, pageSize, total);
    }

    public async Task<DirectorDto> GetAsync(Guid id, CancellationToken ct)
    {
        var director = await db.Directors.AsNoTracking()
            .Include(d => d.Participant)
            .FirstOrDefaultAsync(d => d.ParticipantId == id, ct)
            ?? throw new NotFoundException(nameof(Director), id);

        return director.ToDto(DateOnly.FromDateTime(DateTime.UtcNow));
    }

    public async Task<DirectorDto> UpdateAsync(Guid id, UpdateDirectorRequest request, CancellationToken ct)
    {
        currentUser.EnsureOwnerOrAdmin(id);

        var director = await db.Directors
            .Include(d => d.Participant)
            .FirstOrDefaultAsync(d => d.ParticipantId == id, ct)
            ?? throw new NotFoundException(nameof(Director), id);

        director.DateOfBirth = request.DateOfBirth;
        director.Origin = request.Origin;
        director.Gender = request.Gender;
        director.Bio = request.Bio;

        await db.SaveChangesAsync(ct);
        await profileCompletion.RefreshAsync(id, ct);
        return director.ToDto(DateOnly.FromDateTime(DateTime.UtcNow));
    }
}