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
        [FromQuery] ParticipantRole? role,
        [FromQuery] bool? locked,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await admin.ListAccountsAsync(search, role, locked, page, pageSize, ct));

    [HttpGet("accounts/{id:guid}")]
    public async Task<ActionResult<AdminAccountDetailDto>> GetAccount(Guid id, CancellationToken ct)
        => Ok(await admin.GetAccountAsync(id, ct));

    [HttpPost("accounts/{id:guid}/lock")]
    public async Task<ActionResult<AdminAccountDto>> Lock(
        Guid id, [FromBody] LockAccountRequest request, CancellationToken ct)
        => Ok(await admin.LockAccountAsync(id, request, ct));

    [HttpPost("accounts/{id:guid}/unlock")]
    public async Task<ActionResult<AdminAccountDto>> Unlock(
        Guid id, [FromQuery, StringLength(500)] string? reason, CancellationToken ct)
        => Ok(await admin.UnlockAccountAsync(id, reason, ct));

    [HttpPost("accounts/{id:guid}/force-logout")]
    public async Task<ActionResult<ForceLogoutResult>> ForceLogout(
        Guid id, [FromQuery, StringLength(500)] string? reason, CancellationToken ct)
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

    [HttpDelete("films/{id:guid}")]
    public async Task<IActionResult> DeleteFilm(
        Guid id, [FromQuery, StringLength(500, MinimumLength = 3)] string reason, CancellationToken ct)
    {
        await admin.DeleteFilmAsync(id, reason, ct);
        return NoContent();
    }

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
        [FromQuery] AdminAction? action,
        [FromQuery] Guid? targetId,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await admin.ListAuditAsync(action, targetId, page, pageSize, ct));
}