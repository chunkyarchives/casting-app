using CastingApp.Api.Filters;
using CastingApp.Api.RateLimiting;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Crews;
using CastingApp.Application.Services.Crews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/crews")]
[RequireCompleteProfile]
public class CrewsController(ICrewService crews) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = AppRoles.DirectorCastingDirectorOrAdmin)]
    public async Task<ActionResult<IReadOnlyList<CrewSummaryDto>>> List(
        [FromQuery] Guid? directorId, CancellationToken ct)
        => Ok(await crews.ListAsync(directorId, ct));

    [HttpGet("{id:guid}")]
    [Authorize(Roles = AppRoles.DirectorCastingDirectorOrAdmin)]
    public async Task<ActionResult<CrewDto>> Get(Guid id, CancellationToken ct)
        => Ok(await crews.GetAsync(id, ct));

    [HttpPost]
    [Authorize(Roles = AppRoles.Director)]
    public async Task<ActionResult<CrewDto>> Create(CreateCrewRequest request, CancellationToken ct)
    {
        var crew = await crews.CreateAsync(request, ct);
        return CreatedAtAction(nameof(Get), new { id = crew.Id }, crew);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    public async Task<ActionResult<CrewDto>> Update(Guid id, UpdateCrewRequest request, CancellationToken ct)
        => Ok(await crews.UpdateAsync(id, request, ct));

    [HttpPost("{id:guid}/regenerate-code")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    public async Task<ActionResult<CrewDto>> RegenerateCode(Guid id, CancellationToken ct)
        => Ok(await crews.RegenerateCodeAsync(id, ct));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await crews.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpPost("join")]
    [Authorize(Roles = AppRoles.CastingDirector)]
    [EnableRateLimiting(RateLimitPolicies.JoinCrew)]
    public async Task<ActionResult<CrewDto>> Join(JoinCrewRequest request, CancellationToken ct)
        => Ok(await crews.JoinAsync(request, ct));

    [HttpDelete("{crewId:guid}/members/{castingDirectorId:guid}")]
    [Authorize(Roles = AppRoles.DirectorCastingDirectorOrAdmin)]
    public async Task<IActionResult> RemoveMember(Guid crewId, Guid castingDirectorId, CancellationToken ct)
    {
        await crews.RemoveMemberAsync(crewId, castingDirectorId, ct);
        return NoContent();
    }
}