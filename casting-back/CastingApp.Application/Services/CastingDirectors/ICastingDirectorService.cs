using CastingApp.Application.Common;
using CastingApp.Application.DTOs.CastingDirectors;

namespace CastingApp.Application.Services.CastingDirectors;

public interface ICastingDirectorService
{
    Task<PagedResult<CastingDirectorSummaryDto>> ListAsync(string? search, int page, int pageSize, CancellationToken ct);
    Task<CastingDirectorDto> GetAsync(Guid id, CancellationToken ct);
    Task<CastingDirectorDto> UpdateAsync(Guid id, UpdateCastingDirectorRequest request, CancellationToken ct);
}