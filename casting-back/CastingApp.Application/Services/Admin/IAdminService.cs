using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Admin;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.Services.Admin;

public interface IAdminService
{
    Task<AdminStatsDto> GetStatsAsync(CancellationToken ct);
    Task<IReadOnlyList<TimelinePointDto>> GetTimelineAsync(int days, CancellationToken ct);

    Task<PagedResult<AdminAccountDto>> ListAccountsAsync(
        string? search, ParticipantRole? role, bool? locked, int page, int pageSize, CancellationToken ct);
    Task<AdminAccountDetailDto> GetAccountAsync(Guid id, CancellationToken ct);
    Task<AdminAccountDto> LockAccountAsync(Guid id, LockAccountRequest request, CancellationToken ct);
    Task<AdminAccountDto> UnlockAccountAsync(Guid id, string? reason, CancellationToken ct);
    Task<ForceLogoutResult> ForceLogoutAsync(Guid id, string? reason, CancellationToken ct);
    Task DeleteAccountAsync(Guid id, string reason, CancellationToken ct);

    Task<PagedResult<AdminFilmDto>> ListFilmsAsync(
        string? search, FilmStatus? status, int page, int pageSize, CancellationToken ct);
    Task DeleteFilmAsync(Guid id, string reason, CancellationToken ct);

    Task<PagedResult<AdminConversationDto>> ListConversationsAsync(
        Guid? participantId, int page, int pageSize, CancellationToken ct);
    Task DeleteConversationAsync(Guid id, string reason, CancellationToken ct);

    Task<PagedResult<AuditEntryDto>> ListAuditAsync(
        AdminAction? action, Guid? targetId, int page, int pageSize, CancellationToken ct);
}