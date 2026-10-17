using CastingApp.Domain.Entities;

namespace CastingApp.Application.Services.Profiles;
internal static class ProfileRules
{
    // "!= default" radi i za nullable i za obična polja (datum) "> 0" radi i za int? i za int
    public static bool IsComplete(Actor a, bool hasProfilePicture) =>
        a.DateOfBirth != default
        && Has(a.Gender)
        && Has(a.Origin)
        && a.Height > 0
        && a.Weight > 0
        && hasProfilePicture;

    public static bool IsComplete(Director d) =>
        d.DateOfBirth != default && Has(d.Gender) && Has(d.Origin);

    public static bool IsComplete(CastingDirector c) =>
        c.DateOfBirth != default && Has(c.Gender);

    private static bool Has(string? value) => !string.IsNullOrWhiteSpace(value);
}