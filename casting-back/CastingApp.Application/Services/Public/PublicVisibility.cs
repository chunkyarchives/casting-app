using System.Linq.Expressions;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.Services.Public;

internal static class PublicVisibility
{
    public static Expression<Func<Participant, bool>> IsPublicProfile(DateTime now)
    {
        DateTimeOffset unlockedBy = now;

        return p => p.IsProfilePublic
            && p.Role != ParticipantRole.Admin
            && p.ProfileCompletedAt != null
            && (p.DeactivatedUntil == null || p.DeactivatedUntil <= now)
            && (p.LockoutEnd == null || p.LockoutEnd <= unlockedBy);
    }

    public static Expression<Func<Film, bool>> IsPublicFilm(DateTime now) => f =>
        f.Status == FilmStatus.Active
        && (f.Director.Participant.DeactivatedUntil == null || f.Director.Participant.DeactivatedUntil <= now);
}