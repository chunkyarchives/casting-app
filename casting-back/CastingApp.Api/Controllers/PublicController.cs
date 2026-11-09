using System.ComponentModel.DataAnnotations;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Public;
using CastingApp.Application.Services.Public;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/public")]
[AllowAnonymous]
public class PublicController(IPublicService publicData) : ControllerBase
{
    [HttpGet("films")]
    public async Task<ActionResult<PagedResult<PublicFilmDto>>> Films(
        [FromQuery, StringLength(100)] string? search,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 48)] int pageSize = 12,
        CancellationToken ct = default)
        => Ok(await publicData.ListFilmsAsync(search, page, pageSize, ct));

    [HttpGet("roles/popular")]
    public async Task<ActionResult<IReadOnlyList<PublicRoleDto>>> PopularRoles(
        [FromQuery, Range(1, 48)] int limit = 12,
        CancellationToken ct = default)
        => Ok(await publicData.ListPopularRolesAsync(limit, ct));

    [HttpGet("people")]
    public async Task<ActionResult<PagedResult<PublicPersonDto>>> People(
        [FromQuery] ParticipantRole? role,
        [FromQuery, StringLength(100)] string? search,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 48)] int pageSize = 12,
        CancellationToken ct = default)
        => Ok(await publicData.ListPeopleAsync(role, search, page, pageSize, ct));
}