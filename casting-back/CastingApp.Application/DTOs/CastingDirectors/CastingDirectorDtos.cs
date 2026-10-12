using System.ComponentModel.DataAnnotations;
using CastingApp.Application.Common;
using CastingApp.Domain.Entities;

namespace CastingApp.Application.DTOs.CastingDirectors;

public record CastingDirectorSummaryDto(Guid Id, string FirstName, string LastName, string? Gender);

public record CastingDirectorDto(
    Guid Id,
    string FirstName,
    string LastName,
    DateOnly? DateOfBirth,
    int? Age,
    string? Gender);

public record UpdateCastingDirectorRequest(
    DateOnly? DateOfBirth,
    [StringLength(20)] string? Gender) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) =>
        DateOfBirthRule.Validate(DateOfBirth);
}

internal static class CastingDirectorMappings
{
    public static CastingDirectorSummaryDto ToSummaryDto(this CastingDirector c) => new(
        c.ParticipantId, c.Participant.FirstName, c.Participant.LastName, c.Gender);

    public static CastingDirectorDto ToDto(this CastingDirector c, DateOnly today) => new(
        c.ParticipantId, c.Participant.FirstName, c.Participant.LastName,
        c.DateOfBirth, AgeCalculator.AgeOn(c.DateOfBirth, today), c.Gender);
}