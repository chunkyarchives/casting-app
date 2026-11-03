using System.ComponentModel.DataAnnotations;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Admin;
using CastingApp.Application.Services.Admin;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = AppRoles.Admin)]
public class AdminController(IAdminService admin) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<ActionResult<AdminStatsDto>> Stats(CancellationToken ct)
        => Ok(await admin.GetStatsAsync(ct));

    [HttpGet("stats/timeline")]
    public async Task<ActionResult<IReadOnlyList<TimelinePointDto>>> Timeline(
        [FromQuery, Range(1, 90)] int days = 30,
        CancellationToken ct = default)
        => Ok(await admin.GetTimelineAsync(days, ct));

    [HttpGet("accounts")]
    public async Task<ActionResult<PagedResult<AdminAccountDto>>> ListAccounts(
        [FromQuery] string? search,
        [FromQuery] ParticipantRole[]? roles,
        [FromQuery] bool? locked,
        [FromQuery] bool? profileComplete,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default) => Ok(await admin.ListAccountsAsync(new AccountListFilter(search, roles ?? [], locked, profileComplete), page, pageSize, ct));

    [HttpGet("accounts/{id:guid}")]
    public async Task<ActionResult<AdminAccountDetailDto>> GetAccount(Guid id, CancellationToken ct)
        => Ok(await admin.GetAccountAsync(id, ct));

    [HttpPost("accounts/{id:guid}/lock")]
    public async Task<ActionResult<AdminAccountDto>> Lock(Guid id, [FromBody] LockAccountRequest request, CancellationToken ct)
        => Ok(await admin.LockAccountAsync(id, request, ct));

    [HttpPost("accounts/{id:guid}/unlock")]
    public async Task<ActionResult<AdminAccountDto>> Unlock(Guid id, [FromQuery, StringLength(500)] string? reason, CancellationToken ct)
        => Ok(await admin.UnlockAccountAsync(id, reason, ct));

    [HttpPost("accounts/{id:guid}/force-logout")]
    public async Task<ActionResult<ForceLogoutResult>> ForceLogout(Guid id, [FromQuery, StringLength(500)] string? reason, CancellationToken ct)
        => Ok(await admin.ForceLogoutAsync(id, reason, ct));

    [HttpDelete("accounts/{id:guid}")]
    public async Task<IActionResult> DeleteAccount(
        Guid id, [FromQuery, StringLength(500, MinimumLength = 3)] string reason, CancellationToken ct)
    {
        await admin.DeleteAccountAsync(id, reason, ct);
        return NoContent();
    }

    [HttpGet("films")]
    public async Task<ActionResult<PagedResult<AdminFilmDto>>> ListFilms(
        [FromQuery] string? search,
        [FromQuery] FilmStatus? status,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await admin.ListFilmsAsync(search, status, page, pageSize, ct));

    [HttpGet("films/{id:guid}")]
    public async Task<ActionResult<AdminFilmDetailDto>> GetFilm(Guid id, CancellationToken ct) => Ok(await admin.GetFilmAsync(id, ct));

    [HttpDelete("films/{id:guid}")]
    public async Task<IActionResult> DeleteFilm(
        Guid id, [FromQuery, StringLength(500, MinimumLength = 3)] string reason, CancellationToken ct)
    {
        await admin.DeleteFilmAsync(id, reason, ct);
        return NoContent();
    }

    [HttpGet("crews")]
    public async Task<ActionResult<PagedResult<AdminCrewDto>>> ListCrews(
        [FromQuery] string? search,
        [FromQuery] bool? hasFilms,
        [FromQuery] bool? hasMembers,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await admin.ListCrewsAsync(new CrewListFilter(search, hasFilms, hasMembers), page, pageSize, ct));

    [HttpGet("crews/{id:guid}")]
    public async Task<ActionResult<AdminCrewDetailDto>> GetCrew(Guid id, CancellationToken ct)
        => Ok(await admin.GetCrewAsync(id, ct));

    [HttpPost("crews/{id:guid}/regenerate-code")]
    public async Task<ActionResult<CrewCodeResult>> RegenerateCrewCode(
        Guid id, [FromQuery, StringLength(500)] string? reason, CancellationToken ct)
        => Ok(await admin.RegenerateCrewCodeAsync(id, reason, ct));

    [HttpDelete("crews/{id:guid}/members/{castingDirectorId:guid}")]
    public async Task<IActionResult> RemoveCrewMember(Guid id, Guid castingDirectorId, [FromQuery, StringLength(500, MinimumLength = 3)] string reason, CancellationToken ct)
    {
        await admin.RemoveCrewMemberAsync(id, castingDirectorId, reason, ct);
        return NoContent();
    }

    [HttpDelete("crews/{id:guid}")]
    public async Task<IActionResult> DeleteCrew(Guid id, [FromQuery, StringLength(500, MinimumLength = 3)] string reason, CancellationToken ct)
    {
        await admin.DeleteCrewAsync(id, reason, ct);
        return NoContent();
    }

    [HttpGet("directors")]
    public async Task<ActionResult<PagedResult<AdminDirectorDto>>> ListDirectors(
        [FromQuery] string? search,
        [FromQuery] bool? hasProduction,
        [FromQuery] bool? hasFilms,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await admin.ListDirectorsAsync(new DirectorListFilter(search, hasProduction, hasFilms), page, pageSize, ct));

    [HttpGet("directors/{id:guid}/films")]
    public async Task<ActionResult<IReadOnlyList<AdminFilmDto>>> ListDirectorFilms(Guid id, CancellationToken ct)
        => Ok(await admin.ListDirectorFilmsAsync(id, ct));

    [HttpGet("conversations")]
    public async Task<ActionResult<PagedResult<AdminConversationDto>>> ListConversations(
        [FromQuery] Guid? participantId,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await admin.ListConversationsAsync(participantId, page, pageSize, ct));

    [HttpDelete("conversations/{id:guid}")]
    public async Task<IActionResult> DeleteConversation(
        Guid id, [FromQuery, StringLength(500, MinimumLength = 3)] string reason, CancellationToken ct)
    {
        await admin.DeleteConversationAsync(id, reason, ct);
        return NoContent();
    }

    [HttpGet("audit")]
    public async Task<ActionResult<PagedResult<AuditEntryDto>>> Audit(
        [FromQuery] string? search,
        [FromQuery] AdminAction[]? actions,
        [FromQuery] Guid? targetId,
        [FromQuery] DateTimeOffset? from,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await admin.ListAuditAsync(new AuditListFilter(search, actions ?? [], targetId, from?.UtcDateTime), page, pageSize, ct));
}