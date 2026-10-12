using System.ComponentModel.DataAnnotations;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.DTOs.Films;

public record FilmRoleDto(
    Guid Id,
    Guid FilmId,
    string Name,
    int? AgeMin,
    int? AgeMax,
    int? HeightMin,
    int? HeightMax,
    int? WeightMin,
    int? WeightMax,
    string? Gender,
    string? Origin,
    FilmRoleStatus Status,
    int RowVersion);

public record CreateFilmRoleRequest(
    [StringLength(200)] string Name,
    [Range(0, 120)] int? AgeMin,
    [Range(0, 120)] int? AgeMax,
    [Range(0, 300)] int? HeightMin,
    [Range(0, 300)] int? HeightMax,
    [Range(0, 500)] int? WeightMin,
    [Range(0, 500)] int? WeightMax,
    [StringLength(20)] string? Gender,
    [StringLength(100)] string? Origin) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) =>
        RoleRangeValidation.Validate(AgeMin, AgeMax, HeightMin, HeightMax, WeightMin, WeightMax);
}

public record UpdateFilmRoleRequest(
    [StringLength(200)] string Name,
    [Range(0, 120)] int? AgeMin,
    [Range(0, 120)] int? AgeMax,
    [Range(0, 300)] int? HeightMin,
    [Range(0, 300)] int? HeightMax,
    [Range(0, 500)] int? WeightMin,
    [Range(0, 500)] int? WeightMax,
    [StringLength(20)] string? Gender,
    [StringLength(100)] string? Origin,
    int RowVersion) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) =>
        RoleRangeValidation.Validate(AgeMin, AgeMax, HeightMin, HeightMax, WeightMin, WeightMax);
}

internal static class RoleRangeValidation
{
    public static IEnumerable<ValidationResult> Validate(
        int? ageMin, int? ageMax, int? heightMin, int? heightMax, int? weightMin, int? weightMax)
    {
        if (ageMin > ageMax)
            yield return new ValidationResult("AgeMin must not be greater than AgeMax.", new[] { "AgeMin" });
        if (heightMin > heightMax)
            yield return new ValidationResult("HeightMin must not be greater than HeightMax.", new[] { "HeightMin" });
        if (weightMin > weightMax)
            yield return new ValidationResult("WeightMin must not be greater than WeightMax.", new[] { "WeightMin" });
    }
}