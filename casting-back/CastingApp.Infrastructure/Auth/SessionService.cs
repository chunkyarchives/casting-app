using System.Security.Cryptography;
using System.Text;
using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Infrastructure.Auth;

public class SessionService(
    IAppDbContext db,
    UserManager<Participant> users,
    IJwtTokenService jwt,
    JwtOptions options) : ISessionService
{
    private static readonly TimeSpan reuseGrace = TimeSpan.FromSeconds(10);

    public async Task<RefreshTokenIssue> StartAsync(Guid participantId, CancellationToken ct)
    {
        var now = DateTime.UtcNow;

        // Čišćenje bez posebnog posla u pozadini: tokeni istekli pre više od 7 dana više nikome ne trebaju
        var cutoff = now.AddDays(-7);
        await db.RefreshTokens.Where(t => t.ExpiresAt < cutoff).ExecuteDeleteAsync(ct);

        var (raw, entity) = Create(participantId, Guid.CreateVersion7(), now);
        db.RefreshTokens.Add(entity);
        await db.SaveChangesAsync(ct);

        return new RefreshTokenIssue(raw, entity.ExpiresAt);
    }

    public async Task<SessionRefreshResult> RefreshAsync(string? rawRefreshToken, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(rawRefreshToken))
            throw new UnauthorizedException("Session expired.");

        var hash = Hash(rawRefreshToken);
        var stored = await db.RefreshTokens.AsNoTracking()
            .FirstOrDefaultAsync(t => t.TokenHash == hash, ct)
            ?? throw new UnauthorizedException("Session expired.");

        var now = DateTime.UtcNow;

        if (stored.RevokedAt is { } revokedAt)
        {
            // Token je već iskorišćen. Ako je zamenjen malopre, klijent samo treba da ponovi poziv
            // sa novim cookie-jem. Ako je zamenjen davno, neko ga ponovo šalje (krađa ili greška):
            // poništavamo celu prijavu, pa se i pravi korisnik i napadač moraju ponovo prijaviti.
            if (now - revokedAt <= reuseGrace)
                throw new ConflictException("The session is being refreshed. Retry the request.");

            await RevokeFamilyAsync(stored.FamilyId, ct);
            throw new UnauthorizedException("Session expired.");
        }

        if (stored.ExpiresAt <= now)
            throw new UnauthorizedException("Session expired.");

        var user = await users.FindByIdAsync(stored.ParticipantId.ToString());
        if (user is null || await users.IsLockedOutAsync(user))
        {
            await RevokeFamilyAsync(stored.FamilyId, ct);
            throw new UnauthorizedException("Session expired.");
        }

        DateTime? revokedNow = now;
        var claimed = await db.RefreshTokens
            .Where(t => t.Id == stored.Id && t.RevokedAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAt, revokedNow), ct);
        if (claimed == 0)
            throw new ConflictException("The session is being refreshed. Retry the request.");

        var (raw, next) = Create(stored.ParticipantId, stored.FamilyId, now);
        db.RefreshTokens.Add(next);
        await db.SaveChangesAsync(ct);

        return new SessionRefreshResult(jwt.CreateToken(user), new RefreshTokenIssue(raw, next.ExpiresAt));
    }

    public async Task EndAsync(string? rawRefreshToken, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(rawRefreshToken))
            return;

        var hash = Hash(rawRefreshToken);
        var familyId = await db.RefreshTokens.AsNoTracking()
            .Where(t => t.TokenHash == hash)
            .Select(t => (Guid?)t.FamilyId)
            .FirstOrDefaultAsync(ct);

        if (familyId is { } id)
            await RevokeFamilyAsync(id, ct);
    }

    public async Task EndAllAsync(Guid participantId, CancellationToken ct)
    {
        DateTime? now = DateTime.UtcNow;
        await db.RefreshTokens
            .Where(t => t.ParticipantId == participantId && t.RevokedAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAt, now), ct);
    }

    private Task<int> RevokeFamilyAsync(Guid familyId, CancellationToken ct)
    {
        DateTime? now = DateTime.UtcNow;
        return db.RefreshTokens
            .Where(t => t.FamilyId == familyId && t.RevokedAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAt, now), ct);
    }

    private (string Raw, RefreshToken Entity) Create(Guid participantId, Guid familyId, DateTime now)
    {
        var raw = System.Buffers.Text.Base64Url.EncodeToString(RandomNumberGenerator.GetBytes(32));

        var entity = new RefreshToken
        {
            ParticipantId = participantId,
            FamilyId = familyId,
            TokenHash = Hash(raw),
            CreatedAt = now,
            ExpiresAt = now.AddDays(options.RefreshTokenDays)
        };
        return (raw, entity);
    }

    private static string Hash(string raw) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(raw)));
}