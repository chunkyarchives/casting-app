using CastingApp.Application.DTOs.Films;
using CastingApp.Application.Services.Films;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using CastingApp.Application.Common;
using Microsoft.AspNetCore.Authorization;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/films")]
public class FilmsController(IFilmService films, IFilmRoleService roles) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<FilmSummaryDto>>> List([FromQuery] FilmStatus? status, CancellationToken ct)
        => Ok(await films.ListAsync(status, ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FilmDto>> Get(Guid id, CancellationToken ct)
        => Ok(await films.GetAsync(id, ct));

    [HttpPost]
    [Authorize(Roles = AppRoles.Director)]
    public async Task<ActionResult<FilmDto>> Create(CreateFilmRequest request, CancellationToken ct)
    {
        var film = await films.CreateAsync(request, ct);
        return CreatedAtAction(nameof(Get), new { id = film.Id }, film);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    public async Task<ActionResult<FilmDto>> Update(Guid id, UpdateFilmRequest request, CancellationToken ct)
        => Ok(await films.UpdateAsync(id, request, ct));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await films.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpGet("{filmId:guid}/roles")]
    public async Task<ActionResult<IReadOnlyList<FilmRoleDto>>> ListRoles(Guid filmId, CancellationToken ct)
        => Ok(await roles.ListByFilmAsync(filmId, ct));

    [HttpPost("{filmId:guid}/roles")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    public async Task<ActionResult<FilmRoleDto>> CreateRole(Guid filmId, CreateFilmRoleRequest request, CancellationToken ct)
    {
        var role = await roles.CreateAsync(filmId, request, ct);
        return CreatedAtAction(nameof(FilmRolesController.Get), "FilmRoles", new { id = role.Id }, role);
    }
}