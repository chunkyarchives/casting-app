using CastingApp.Domain.Enums;

namespace CastingApp.Application.Common;

// Imena uloga za [Authorize(Roles = ...)]. Vrednosti dolaze iz enuma, pa se uvek poklapaju sa "role" claim-om u tokenu.
public static class AppRoles
{
    public const string Admin = nameof(ParticipantRole.Admin);
    public const string Director = nameof(ParticipantRole.Director);
    public const string CastingDirector = nameof(ParticipantRole.CastingDirector);
    public const string Actor = nameof(ParticipantRole.Actor);

    public const string DirectorOrAdmin = Director + "," + Admin;
    public const string ActorOrAdmin = Actor + "," + Admin;
    public const string CastingDirectorOrAdmin = CastingDirector + "," + Admin;
    public const string ActorOrDirector = Actor + "," + Director;
    public const string ActorOrCastingDirector = Actor + "," + CastingDirector;
    public const string ActorDirectorOrAdmin = Actor + "," + Director + "," + Admin;
    public const string ActorCastingDirectorOrAdmin = Actor + "," + CastingDirector + "," + Admin;
    public const string DirectorCastingDirectorOrAdmin = Director + "," + CastingDirector + "," + Admin;
}