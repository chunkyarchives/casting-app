using CastingApp.Application.DTOs.Films;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.Services.Films;

public interface IFilmService
{
    Task<IReadOnlyList<FilmSummaryDto>> ListAsync(FilmStatus? status, CancellationToken ct);
    Task<FilmDto> GetAsync(Guid id, CancellationToken ct);
    Task<FilmDto> CreateAsync(CreateFilmRequest request, CancellationToken ct);
    Task<FilmDto> UpdateAsync(Guid id, UpdateFilmRequest request, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
}