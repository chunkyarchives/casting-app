using CastingApp.Application.DTOs.RoleApplications;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.Services.RoleApplications;

public interface IRoleApplicationService
{
    Task<IReadOnlyList<RoleApplicationDto>> ListAsync(
        Guid? filmRoleId, Guid? actorId, ApplicationStatus? status, CancellationToken ct);
    Task<RoleApplicationDto> GetAsync(Guid id, CancellationToken ct);
    Task<RoleApplicationDto> CreateAsync(Guid filmRoleId, CreateRoleApplicationRequest request, CancellationToken ct);
    Task<RoleApplicationDto> AcceptAsync(Guid id, CancellationToken ct);
    Task<RoleApplicationDto> RejectAsync(Guid id, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);   
}