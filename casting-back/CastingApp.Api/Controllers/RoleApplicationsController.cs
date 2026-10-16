using CastingApp.Application.DTOs.RoleApplications;
using CastingApp.Application.Services.RoleApplications;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using CastingApp.Application.Common;
using Microsoft.AspNetCore.Authorization;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/applications")]
public class ApplicationsController(IRoleApplicationService applications) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<RoleApplicationDto>>> List(
        [FromQuery] Guid? filmRoleId,
        [FromQuery] Guid? actorId,
        [FromQuery] ApplicationStatus? status,
        CancellationToken ct)
        => Ok(await applications.ListAsync(filmRoleId, actorId, status, ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RoleApplicationDto>> Get(Guid id, CancellationToken ct)
        => Ok(await applications.GetAsync(id, ct));

    [HttpPost("{id:guid}/accept")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    public async Task<ActionResult<RoleApplicationDto>> Accept(Guid id, CancellationToken ct)
        => Ok(await applications.AcceptAsync(id, ct));

    [HttpPost("{id:guid}/reject")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    public async Task<ActionResult<RoleApplicationDto>> Reject(Guid id, CancellationToken ct)
        => Ok(await applications.RejectAsync(id, ct));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AppRoles.ActorCastingDirectorOrAdmin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await applications.DeleteAsync(id, ct);
        return NoContent();
    }
}