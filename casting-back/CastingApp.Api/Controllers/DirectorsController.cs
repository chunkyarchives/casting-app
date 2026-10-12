using System.ComponentModel.DataAnnotations;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Directors;
using CastingApp.Application.Services.Directors;
using Microsoft.AspNetCore.Mvc;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/directors")]
public class DirectorsController(IDirectorService directors) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<DirectorSummaryDto>>> List(
        [FromQuery, StringLength(100)] string? search,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await directors.ListAsync(search, page, pageSize, ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DirectorDto>> Get(Guid id, CancellationToken ct)
        => Ok(await directors.GetAsync(id, ct));

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<DirectorDto>> Update(Guid id, UpdateDirectorRequest request, CancellationToken ct)
        => Ok(await directors.UpdateAsync(id, request, ct));
}