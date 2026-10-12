using System.ComponentModel.DataAnnotations;

namespace CastingApp.Application.Common;

internal static class AgeCalculator
{
    public static int? AgeOn(DateOnly? dateOfBirth, DateOnly today)
    {
        if (dateOfBirth is not { } dob) return null;

        var age = today.Year - dob.Year;
        if (dob > today.AddYears(-age)) age--;   
        return age;
    }
}

internal static class DateOfBirthRule
{
    public static IEnumerable<ValidationResult> Validate(DateOnly? dateOfBirth)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (dateOfBirth is { } dob && (dob > today || dob.Year < 1900))
            yield return new ValidationResult("DateOfBirth is not a valid date.", new[] { "DateOfBirth" });
    }
}