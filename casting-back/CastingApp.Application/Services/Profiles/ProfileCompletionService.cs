using CastingApp.Application.Abstractions;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Profiles;

public interface IProfileCompletionService
{
    Task<bool> RefreshAsync(Guid participantId, CancellationToken ct = default);
}

public class ProfileCompletionService(IAppDbContext db) : IProfileCompletionService
{
    public async Task<bool> RefreshAsync(Guid participantId, CancellationToken ct = default)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == participantId, ct);
        if (user is null)
            return false;

        var complete = user.Role switch
        {
            ParticipantRole.Admin => true,
            ParticipantRole.Actor => await IsActorCompleteAsync(participantId, user.ProfilePictureId is not null, ct),
            ParticipantRole.Director => await IsDirectorCompleteAsync(participantId, ct),
            ParticipantRole.CastingDirector => await IsCastingDirectorCompleteAsync(participantId, ct),
            _ => false
        };

        if (complete == (user.ProfileCompletedAt is not null))
            return complete;

        user.ProfileCompletedAt = complete ? DateTime.UtcNow : null;
        await db.SaveChangesAsync(ct);
        return complete;
    }

    private async Task<bool> IsActorCompleteAsync(Guid id, bool hasPicture, CancellationToken ct)
    {
        var actor = await db.Actors.AsNoTracking().FirstOrDefaultAsync(a => a.ParticipantId == id, ct);
        return actor is not null && ProfileRules.IsComplete(actor, hasPicture);
    }

    private async Task<bool> IsDirectorCompleteAsync(Guid id, CancellationToken ct)
    {
        var director = await db.Directors.AsNoTracking().FirstOrDefaultAsync(d => d.ParticipantId == id, ct);
        return director is not null && ProfileRules.IsComplete(director);
    }

    private async Task<bool> IsCastingDirectorCompleteAsync(Guid id, CancellationToken ct)
    {
        var casting = await db.CastingDirectors.AsNoTracking().FirstOrDefaultAsync(c => c.ParticipantId == id, ct);
        return casting is not null && ProfileRules.IsComplete(casting);
    }
}