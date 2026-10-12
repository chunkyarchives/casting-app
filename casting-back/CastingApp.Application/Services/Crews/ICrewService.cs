using CastingApp.Application.DTOs.Crews;

namespace CastingApp.Application.Services.Crews;

public interface ICrewService
{
    Task<IReadOnlyList<CrewSummaryDto>> ListAsync(Guid? directorId, CancellationToken ct);
    Task<CrewDto> GetAsync(Guid id, CancellationToken ct);
    Task<CrewDto> CreateAsync(CreateCrewRequest request, CancellationToken ct);
    Task<CrewDto> UpdateAsync(Guid id, UpdateCrewRequest request, CancellationToken ct);
    Task<CrewDto> RegenerateCodeAsync(Guid id, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
    Task<CrewDto> JoinAsync(JoinCrewRequest request, CancellationToken ct);
    Task RemoveMemberAsync(Guid crewId, Guid castingDirectorId, CancellationToken ct);
}