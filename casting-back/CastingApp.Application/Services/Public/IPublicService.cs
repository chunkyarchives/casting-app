using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Public;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.Services.Public;

public interface IPublicService
{
    Task<PagedResult<PublicFilmDto>> ListFilmsAsync(string? search, int page, int pageSize, CancellationToken ct);
    Task<IReadOnlyList<PublicRoleDto>> ListPopularRolesAsync(int limit, CancellationToken ct);
    Task<PagedResult<PublicPersonDto>> ListPeopleAsync(ParticipantRole? role, string? search, int page, int pageSize, CancellationToken ct);
}