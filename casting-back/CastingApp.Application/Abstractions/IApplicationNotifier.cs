using CastingApp.Application.DTOs.RoleApplications;

namespace CastingApp.Application.Abstractions;

public interface IApplicationNotifier
{
    Task ApplicationCreatedAsync(RoleApplicationDto application, Guid directorId, CancellationToken ct);
}