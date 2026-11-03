using CastingApp.Application.Abstractions;
using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Films;

internal static class FilmRemoval
{
    public static async Task<IReadOnlyList<string>> RemoveAsync(IAppDbContext db, Film film, CancellationToken ct)
    {
        var storageKeys = await db.MediaAssets.AsNoTracking()
            .Where(m => m.Id == film.PosterId || db.FilmRoles.Any(r => r.Id == m.FilmRoleId && r.FilmId == film.Id))
            .Select(m => m.StorageKey)
            .ToListAsync(ct);

        if (film.PosterId is { } posterId
            && await db.MediaAssets.FirstOrDefaultAsync(m => m.Id == posterId, ct) is { } poster)
        {
            db.MediaAssets.Remove(poster);
        }

        db.Films.Remove(film);
        return storageKeys;
    }
}