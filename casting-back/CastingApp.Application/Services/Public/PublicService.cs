using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Public;
using CastingApp.Application.Services.Media;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Public;

public class PublicService(IAppDbContext db) : IPublicService
{
    public async Task<PagedResult<PublicFilmDto>> ListFilmsAsync(string? search, int page, int pageSize, CancellationToken ct)
    {
        var query = db.Films.AsNoTracking().Where(PublicVisibility.IsPublicFilm(DateTime.UtcNow));
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(f => f.Title.ToLower().Contains(term));
        }

        var total = await query.CountAsync(ct);
        var films = await query
            .OrderByDescending(f => f.CreatedAt)
            .ThenBy(f => f.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(f => new PublicFilmDto(
                f.Id,
                f.Title,
                f.Description,
                f.ContentRating,
                f.ReleaseYear,
                f.Director.Participant.FirstName + " " + f.Director.Participant.LastName,
                MediaUrls.PublicPoster(f.Id, f.PosterId),
                f.Roles.Count(r => r.Status == FilmRoleStatus.Open)))
            .ToListAsync(ct);

        return new PagedResult<PublicFilmDto>(films, page, pageSize, total);
    }

    public async Task<IReadOnlyList<PublicRoleDto>> ListPopularRolesAsync(int limit, CancellationToken ct)
        => await db.Films.AsNoTracking()
            .Where(PublicVisibility.IsPublicFilm(DateTime.UtcNow))
            .SelectMany(f => f.Roles)
            .Where(r => r.Status == FilmRoleStatus.Open)
            .OrderByDescending(r => r.Applications.Count)
            .ThenBy(r => r.Name)
            .ThenBy(r => r.Id)
            .Take(limit)
            .Select(r => new PublicRoleDto(
                r.Id,
                r.Name,
                r.Description,
                r.Gender,
                r.Origin,
                r.AgeMin,
                r.AgeMax,
                r.FilmId,
                r.Film.Title,
                MediaUrls.PublicPoster(r.FilmId, r.Film.PosterId),
                r.Applications.Count))
            .ToListAsync(ct);

    public async Task<PagedResult<PublicPersonDto>> ListPeopleAsync(
        ParticipantRole? role, string? search, int page, int pageSize, CancellationToken ct)
    {
        var query = db.Users.AsNoTracking().Where(PublicVisibility.IsPublicProfile(DateTime.UtcNow));
        if (role is { } r)
            query = query.Where(u => u.Role == r);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(u => (u.FirstName + " " + u.LastName).ToLower().Contains(term));
        }

        var total = await query.CountAsync(ct);
        var people = await query
            .Include(u => u.Actor)
            .Include(u => u.Director)
            .Include(u => u.CastingDirector)
            .OrderBy(u => u.LastName)
            .ThenBy(u => u.FirstName)
            .ThenBy(u => u.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        return new PagedResult<PublicPersonDto>(people.Select(p => ToPersonDto(p, today)).ToList(), page, pageSize, total);
    }

    private static PublicPersonDto ToPersonDto(Participant p, DateOnly today) => new(
        p.Id,
        p.FirstName,
        p.LastName,
        p.Role,
        MediaUrls.PublicProfilePicture(p.Id, p.ProfilePictureId),
        p.Actor?.Origin ?? p.Director?.Origin ?? p.CastingDirector?.Origin,
        AgeCalculator.AgeOn(p.Actor?.DateOfBirth ?? p.Director?.DateOfBirth ?? p.CastingDirector?.DateOfBirth, today),
        p.Actor?.Bio ?? p.Director?.Bio);
}