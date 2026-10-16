using System.ComponentModel.DataAnnotations;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.CastingDirectors;
using CastingApp.Application.Services.CastingDirectors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/casting-directors")]
public class CastingDirectorsController(ICastingDirectorService castingDirectors) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = AppRoles.DirectorCastingDirectorOrAdmin)]
    public async Task<ActionResult<PagedResult<CastingDirectorSummaryDto>>> List(
        [FromQuery, StringLength(100)] string? search,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await castingDirectors.ListAsync(search, page, pageSize, ct));

    [HttpGet("{id:guid}")]
    [Authorize(Roles = AppRoles.DirectorCastingDirectorOrAdmin)]
    public async Task<ActionResult<CastingDirectorDto>> Get(Guid id, CancellationToken ct)
        => Ok(await castingDirectors.GetAsync(id, ct));

    [HttpPut("{id:guid}")]
    [Authorize(Roles = AppRoles.CastingDirectorOrAdmin)]
    public async Task<ActionResult<CastingDirectorDto>> Update(
        Guid id, UpdateCastingDirectorRequest request, CancellationToken ct)
        => Ok(await castingDirectors.UpdateAsync(id, request, ct));
}