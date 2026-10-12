using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Actors;

namespace CastingApp.Application.Services.Actors;

public interface IActorService
{
    Task<PagedResult<ActorSummaryDto>> ListAsync(ActorFilter filter, int page, int pageSize, CancellationToken ct);
    Task<PagedResult<ActorSummaryDto>> ListMatchingAsync(Guid filmRoleId, int page, int pageSize, CancellationToken ct);
    Task<ActorDto> GetAsync(Guid id, CancellationToken ct);
    Task<ActorDto> UpdateAsync(Guid id, UpdateActorRequest request, CancellationToken ct);
}