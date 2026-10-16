using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Films;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Films;

public class FilmRoleService(IAppDbContext db, ICurrentUser currentUser) : IFilmRoleService
{
    public async Task<IReadOnlyList<FilmRoleDto>> ListByFilmAsync(Guid filmId, CancellationToken ct)
    {
        if (!await db.Films.AnyAsync(f => f.Id == filmId, ct))
            throw new NotFoundException(nameof(Film), filmId);

        var roles = await db.FilmRoles.AsNoTracking()
            .Where(r => r.FilmId == filmId)
            .OrderBy(r => r.Name)
            .ToListAsync(ct);

        return roles.Select(r => r.ToDto()).ToList();
    }

    public async Task<FilmRoleDto> GetAsync(Guid id, CancellationToken ct)
    {
        var role = await db.FilmRoles.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id, ct)
            ?? throw new NotFoundException(nameof(FilmRole), id);

        return role.ToDto();
    }

    public async Task<FilmRoleDto> CreateAsync(Guid filmId, CreateFilmRoleRequest request, CancellationToken ct)
    {
        var film = await db.Films.AsNoTracking().FirstOrDefaultAsync(f => f.Id == filmId, ct)
            ?? throw new NotFoundException(nameof(Film), filmId);

        currentUser.EnsureOwnerOrAdmin(film.DirectorId);

        if (film.Status == FilmStatus.Archived)
            throw new ConflictException("Cannot add roles to an archived film.");

        var role = new FilmRole
        {
            FilmId = filmId,
            Name = request.Name.Trim(),
            AgeMin = request.AgeMin,
            AgeMax = request.AgeMax,
            HeightMin = request.HeightMin,
            HeightMax = request.HeightMax,
            WeightMin = request.WeightMin,
            WeightMax = request.WeightMax,
            Gender = request.Gender,
            Origin = request.Origin
        };

        db.FilmRoles.Add(role);
        await db.SaveChangesAsync(ct);
        return role.ToDto();
    }

    public async Task<FilmRoleDto> UpdateAsync(Guid id, UpdateFilmRoleRequest request, CancellationToken ct)
    {
        var role = await db.FilmRoles
            .Include(r => r.Film)
            .FirstOrDefaultAsync(r => r.Id == id, ct)
            ?? throw new NotFoundException(nameof(FilmRole), id);

        currentUser.EnsureOwnerOrAdmin(role.Film.DirectorId);

        // Sloj 1: klijent je menjao staru kopiju (neko je u međuvremenu sačuvao ulogu)
        if (role.RowVersion != request.RowVersion)
            throw new ConflictException("The role was changed by someone else. Reload it and try again.");

        role.Name = request.Name.Trim();
        role.AgeMin = request.AgeMin;
        role.AgeMax = request.AgeMax;
        role.HeightMin = request.HeightMin;
        role.HeightMax = request.HeightMax;
        role.WeightMin = request.WeightMin;
        role.WeightMax = request.WeightMax;
        role.Gender = request.Gender;
        role.Origin = request.Origin;

        try
        {
            // AppDbContext uvećava RowVersion, UPDATE ima "WHERE row_version = <učitana vrednost>"
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateConcurrencyException)
        {
            // Sloj 2: drugi zahtev je sačuvao između našeg čitanja i upisa
            throw new ConflictException("The role was changed by someone else. Reload it and try again.");
        }

        return role.ToDto();
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var role = await db.FilmRoles
            .Include(r => r.Film)
            .FirstOrDefaultAsync(r => r.Id == id, ct)
            ?? throw new NotFoundException(nameof(FilmRole), id);

        currentUser.EnsureOwnerOrAdmin(role.Film.DirectorId);

        db.FilmRoles.Remove(role);
        await db.SaveChangesAsync(ct);
    }
}