using CastingApp.Application.DTOs.Crews;
using CastingApp.Application.Services.Crews;
using Microsoft.AspNetCore.Mvc;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/crews")]
public class CrewsController(ICrewService crews) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CrewSummaryDto>>> List(
        [FromQuery] Guid? directorId, CancellationToken ct)
        => Ok(await crews.ListAsync(directorId, ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CrewDto>> Get(Guid id, CancellationToken ct)
        => Ok(await crews.GetAsync(id, ct));

    [HttpPost]
    public async Task<ActionResult<CrewDto>> Create(CreateCrewRequest request, CancellationToken ct)
    {
        var crew = await crews.CreateAsync(request, ct);
        return CreatedAtAction(nameof(Get), new { id = crew.Id }, crew);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CrewDto>> Update(Guid id, UpdateCrewRequest request, CancellationToken ct)
        => Ok(await crews.UpdateAsync(id, request, ct));

    [HttpPost("{id:guid}/regenerate-code")]
    public async Task<ActionResult<CrewDto>> RegenerateCode(Guid id, CancellationToken ct)
        => Ok(await crews.RegenerateCodeAsync(id, ct));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await crews.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpPost("join")]
    public async Task<ActionResult<CrewDto>> Join(JoinCrewRequest request, CancellationToken ct)
        => Ok(await crews.JoinAsync(request, ct));

    [HttpDelete("{crewId:guid}/members/{castingDirectorId:guid}")]
    public async Task<IActionResult> RemoveMember(Guid crewId, Guid castingDirectorId, CancellationToken ct)
    {
        await crews.RemoveMemberAsync(crewId, castingDirectorId, ct);
        return NoContent();
    }
}