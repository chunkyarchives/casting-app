using CastingApp.Application.DTOs.RoleApplications;
using CastingApp.Application.DTOs.Films;
using CastingApp.Application.Services.RoleApplications;
using CastingApp.Application.Services.Films;
using Microsoft.AspNetCore.Mvc;
using CastingApp.Application.Common;
using Microsoft.AspNetCore.Authorization;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/roles")]
public class FilmRolesController(IFilmRoleService roles, IRoleApplicationService applications) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FilmRoleDto>> Get(Guid id, CancellationToken ct)
        => Ok(await roles.GetAsync(id, ct));

    [HttpPut("{id:guid}")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    public async Task<ActionResult<FilmRoleDto>> Update(Guid id, UpdateFilmRoleRequest request, CancellationToken ct)
        => Ok(await roles.UpdateAsync(id, request, ct));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await roles.DeleteAsync(id, ct);
        return NoContent();
    }

    // Prijava na ulogu (glumac se prijavljuje ili ga casting direktor predlaže)
    [HttpPost("{id:guid}/applications")]
    [Authorize(Roles = AppRoles.ActorOrCastingDirector)]
    public async Task<ActionResult<RoleApplicationDto>> Apply(Guid id, CreateRoleApplicationRequest request, CancellationToken ct)
    {
        var application = await applications.CreateAsync(id, request, ct);
        return CreatedAtAction(nameof(ApplicationsController.Get), "Applications",
            new { id = application.Id }, application);
    }
}