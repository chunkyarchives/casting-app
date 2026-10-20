using System.ComponentModel.DataAnnotations;
using CastingApp.Application.Common;
using CastingApp.Domain.Entities;

namespace CastingApp.Application.DTOs.Directors;

public record DirectorSummaryDto(Guid Id, string FirstName, string LastName, string? Origin, string? Gender);

public record DirectorDto(
    Guid Id,
    string FirstName,
    string LastName,
    DateOnly? DateOfBirth,
    int? Age,
    string? Origin,
    string? Gender,
    string? Bio);

public record UpdateDirectorRequest(
    DateOnly? DateOfBirth,
    [StringLength(100)] string? Origin,
    [StringLength(20)] string? Gender,
    [StringLength(4000)] string? Bio) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) =>
        DateOfBirthRule.Validate(DateOfBirth);
}

internal static class DirectorMappings
{
    public static DirectorSummaryDto ToSummaryDto(this Director d) => new(
        d.ParticipantId, d.Participant.FirstName, d.Participant.LastName, d.Origin, d.Gender);

    public static DirectorDto ToDto(this Director d, DateOnly today, bool includePrivate = false) => new(
        d.ParticipantId, d.Participant.FirstName, d.Participant.LastName,
        includePrivate ? d.DateOfBirth : null, AgeCalculator.AgeOn(d.DateOfBirth, today), d.Origin, d.Gender, d.Bio);
}