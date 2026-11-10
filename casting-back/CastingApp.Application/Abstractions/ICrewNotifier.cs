using CastingApp.Application.DTOs.Crews;

namespace CastingApp.Application.Abstractions;

public interface ICrewNotifier
{
    Task MemberChangedAsync(CrewMemberChangeDto change, IReadOnlyCollection<Guid> recipients, CancellationToken ct);
}