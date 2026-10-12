using System.ComponentModel.DataAnnotations;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.CastingDirectors;
using CastingApp.Application.Services.CastingDirectors;
using Microsoft.AspNetCore.Mvc;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/casting-directors")]
public class CastingDirectorsController(ICastingDirectorService castingDirectors) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<CastingDirectorSummaryDto>>> List(
        [FromQuery, StringLength(100)] string? search,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await castingDirectors.ListAsync(search, page, pageSize, ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CastingDirectorDto>> Get(Guid id, CancellationToken ct)
        => Ok(await castingDirectors.GetAsync(id, ct));

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CastingDirectorDto>> Update(
        Guid id, UpdateCastingDirectorRequest request, CancellationToken ct)
        => Ok(await castingDirectors.UpdateAsync(id, request, ct));
}