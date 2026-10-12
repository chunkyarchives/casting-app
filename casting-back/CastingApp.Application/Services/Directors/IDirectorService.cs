using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Directors;

namespace CastingApp.Application.Services.Directors;

public interface IDirectorService
{
    Task<PagedResult<DirectorSummaryDto>> ListAsync(string? search, int page, int pageSize, CancellationToken ct);
    Task<DirectorDto> GetAsync(Guid id, CancellationToken ct);
    Task<DirectorDto> UpdateAsync(Guid id, UpdateDirectorRequest request, CancellationToken ct);
}