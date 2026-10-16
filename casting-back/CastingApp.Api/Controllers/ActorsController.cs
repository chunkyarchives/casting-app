using System.ComponentModel.DataAnnotations;
using CastingApp.Application.DTOs.Actors;
using CastingApp.Application.Services.Actors;
using Microsoft.AspNetCore.Mvc;
using CastingApp.Application.Common;
using Microsoft.AspNetCore.Authorization;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/actors")]
public class ActorsController(IActorService actors) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = AppRoles.DirectorCastingDirectorOrAdmin)]
    public async Task<ActionResult<PagedResult<ActorSummaryDto>>> List(
        [FromQuery] ActorFilter filter,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await actors.ListAsync(filter, page, pageSize, ct));

    [HttpGet("matching")]
    [Authorize(Roles = AppRoles.DirectorCastingDirectorOrAdmin)]
    public async Task<ActionResult<PagedResult<ActorSummaryDto>>> ListMatching(
        [FromQuery] Guid filmRoleId,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await actors.ListMatchingAsync(filmRoleId, page, pageSize, ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ActorDto>> Get(Guid id, CancellationToken ct)
        => Ok(await actors.GetAsync(id, ct));

    [HttpPut("{id:guid}")]
    [Authorize(Roles = AppRoles.ActorOrAdmin)]
    public async Task<ActionResult<ActorDto>> Update(Guid id, UpdateActorRequest request, CancellationToken ct)
        => Ok(await actors.UpdateAsync(id, request, ct));
}