using CastingApp.Application.Abstractions;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.Common;

internal static class CurrentUserExtensions
{
    public static bool IsAdmin(this ICurrentUser user) => user.Role == ParticipantRole.Admin;

    // Dozvoljeno vlasniku resursa ili adminu; svi ostali dobijaju 403
    public static void EnsureOwnerOrAdmin(this ICurrentUser user, Guid ownerId)
    {
        if (!user.IsAdmin() && user.Id != ownerId)
            throw new ForbiddenException("You do not have access to this resource.");
    }
}