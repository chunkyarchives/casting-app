namespace CastingApp.Application.Abstractions;

public record RefreshTokenIssue(string Value, DateTime ExpiresAt);

public record SessionRefreshResult(AccessToken Access, RefreshTokenIssue Refresh);

public interface ISessionService
{
    Task<RefreshTokenIssue> StartAsync(Guid participantId, CancellationToken ct);
    Task<SessionRefreshResult> RefreshAsync(string? rawRefreshToken, CancellationToken ct);
    Task EndAsync(string? rawRefreshToken, CancellationToken ct);
    Task EndAllAsync(Guid participantId, CancellationToken ct);
}