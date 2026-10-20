using CastingApp.Application.Abstractions;

namespace CastingApp.Application.Common;

internal static class PrivacyExtensions
{
    public static bool CanSeePrivateDataOf(this ICurrentUser user, Guid ownerId)
        => user.IsAdmin() || user.Id == ownerId;
}