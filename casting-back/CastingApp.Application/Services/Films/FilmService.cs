using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Films;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Films;

public class FilmService(IAppDbContext db) : IFilmService
{
    public async Task<IReadOnlyList<FilmSummaryDto>> ListAsync(FilmStatus? status, CancellationToken ct)
    {
        var query = db.Films.AsNoTracking();
        if (status is not null)
            query = query.Where(f => f.Status == status);

        return await query
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new FilmSummaryDto(
                f.Id, f.DirectorId, f.Title, f.ContentRating, f.ReleaseYear, f.Status, f.CreatedAt, f.Roles.Count))
            .ToListAsync(ct);
    }

    public async Task<FilmDto> GetAsync(Guid id, CancellationToken ct)
    {
        var film = await db.Films.AsNoTracking()
            .Include(f => f.Roles)
            .FirstOrDefaultAsync(f => f.Id == id, ct)
            ?? throw new NotFoundException(nameof(Film), id);

        return film.ToDto();
    }

    public async Task<FilmDto> CreateAsync(CreateFilmRequest request, CancellationToken ct)
    {
        if (!await db.Directors.AnyAsync(d => d.ParticipantId == request.DirectorId, ct))
            throw new NotFoundException(nameof(Director), request.DirectorId);

        var film = new Film
        {
            DirectorId = request.DirectorId,
            Title = request.Title.Trim(),
            Description = request.Description,
            ContentRating = request.ContentRating,
            ReleaseYear = request.ReleaseYear
        };

        db.Films.Add(film);
        await db.SaveChangesAsync(ct);
        return film.ToDto();
    }

    public async Task<FilmDto> UpdateAsync(Guid id, UpdateFilmRequest request, CancellationToken ct)
    {
        var film = await db.Films
            .Include(f => f.Roles)
            .FirstOrDefaultAsync(f => f.Id == id, ct)
            ?? throw new NotFoundException(nameof(Film), id);

        film.Title = request.Title.Trim();
        film.Description = request.Description;
        film.ContentRating = request.ContentRating;
        film.ReleaseYear = request.ReleaseYear;
        film.Status = request.Status;

        await db.SaveChangesAsync(ct);
        return film.ToDto();
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var film = await db.Films.FirstOrDefaultAsync(f => f.Id == id, ct)
            ?? throw new NotFoundException(nameof(Film), id);

        db.Films.Remove(film);       // uloge briše baza (ON DELETE CASCADE)
        await db.SaveChangesAsync(ct);
    }
}