using CastingApp.Application.DTOs.Films;

namespace CastingApp.Application.Services.Films;

public interface IFilmRoleService
{
    Task<IReadOnlyList<FilmRoleDto>> ListByFilmAsync(Guid filmId, CancellationToken ct);
    Task<FilmRoleDto> GetAsync(Guid id, CancellationToken ct);
    Task<FilmRoleDto> CreateAsync(Guid filmId, CreateFilmRoleRequest request, CancellationToken ct);
    Task<FilmRoleDto> UpdateAsync(Guid id, UpdateFilmRoleRequest request, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
}