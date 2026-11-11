using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Films;
using CastingApp.Application.Services.Media;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Films;

public class FilmService(IAppDbContext db, ICurrentUser currentUser, IMediaStorage storage) : IFilmService
{
    public async Task<IReadOnlyList<FilmSummaryDto>> ListAsync(FilmStatus? status, Guid? directorId, CancellationToken ct)
    {
        var query = db.Films.AsNoTracking();
        if (status is not null) query = query.Where(f => f.Status == status);
        if (directorId is not null) query = query.Where(f => f.DirectorId == directorId);

        return await query
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new FilmSummaryDto(
                f.Id, f.DirectorId, f.Title, f.ContentRating, f.ReleaseYear, f.Status, f.CreatedAt, f.Roles.Count,
                MediaUrls.Media(f.PosterId)))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<FilmSummaryDto>> ListMineAsync(CancellationToken ct)
    {
        var directorId = currentUser.Id;

        return await db.Films.AsNoTracking()
            .Where(f => f.DirectorId == directorId)
            .OrderBy(f => f.CreatedAt)
            .Select(f => new FilmSummaryDto(
                f.Id, f.DirectorId, f.Title, f.ContentRating, f.ReleaseYear, f.Status, f.CreatedAt, f.Roles.Count,
                MediaUrls.Media(f.PosterId)))
            .ToListAsync(ct);
    }

    public async Task<FilmDto> GetAsync(Guid id, CancellationToken ct)
    {
        var film = await db.Films.AsNoTracking()
            .Include(f => f.Roles).ThenInclude(r => r.ConceptArt)
            .FirstOrDefaultAsync(f => f.Id == id, ct)
            ?? throw new NotFoundException(nameof(Film), id);

        return film.ToDto();
    }

    public async Task<FilmDto> CreateAsync(CreateFilmRequest request, CancellationToken ct)
    {
        var directorId = currentUser.Id;
        if (!await db.Directors.AnyAsync(d => d.ParticipantId == directorId, ct))
            throw new NotFoundException(nameof(Director), directorId);

        var film = new Film
        {
            DirectorId = directorId,
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
            .Include(f => f.Roles).ThenInclude(r => r.ConceptArt)
            .FirstOrDefaultAsync(f => f.Id == id, ct)
            ?? throw new NotFoundException(nameof(Film), id);

        currentUser.EnsureOwnerOrAdmin(film.DirectorId);

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
        var film = await db.Films.FirstOrDefaultAsync(f => f.Id == id, ct) ?? throw new NotFoundException(nameof(Film), id);
        currentUser.EnsureOwnerOrAdmin(film.DirectorId);

        var files = await FilmRemoval.RemoveAsync(db, film, ct);
        await db.SaveChangesAsync(ct);
        await storage.TryDeleteAsync(files);
    }
}