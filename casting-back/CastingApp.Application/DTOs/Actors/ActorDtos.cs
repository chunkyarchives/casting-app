using System.ComponentModel.DataAnnotations;
using CastingApp.Application.Common;
using CastingApp.Domain.Entities;

namespace CastingApp.Application.DTOs.Actors;

public record ActorSummaryDto(
    Guid Id,
    string FirstName,
    string LastName,
    int? Age,
    int? Height,
    int? Weight,
    string? Origin,
    string? Gender);

public record ActorDto(
    Guid Id,
    string FirstName,
    string LastName,
    DateOnly? DateOfBirth,
    int? Age,
    int? Height,
    int? Weight,
    string? Origin,
    string? Gender,
    string? Bio,
    IReadOnlyList<ActorLinkDto> Links,
    IReadOnlyList<string> RoleInterests);

public record ActorLinkDto([StringLength(50)] string Label, [StringLength(500)] string Url) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!Uri.TryCreate(Url, UriKind.Absolute, out var uri)
            || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
            yield return new ValidationResult("Url must be an absolute http(s) URL.", new[] { nameof(Url) });
    }
}

public record UpdateActorRequest(
    DateOnly? DateOfBirth,
    [Range(50, 260)] int? Height,
    [Range(20, 500)] int? Weight,
    [StringLength(100)] string? Origin,
    [StringLength(20)] string? Gender,
    [StringLength(4000)] string? Bio,
    [MaxLength(10)] List<ActorLinkDto>? Links,
    [MaxLength(20)] List<string>? RoleInterests) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        foreach (var result in DateOfBirthRule.Validate(DateOfBirth))
            yield return result;

        if (RoleInterests is not null && RoleInterests.Any(i => string.IsNullOrWhiteSpace(i) || i.Length > 50))
            yield return new ValidationResult(
                "Each role interest must be 1-50 characters.", new[] { nameof(RoleInterests) });
    }
}

public record ActorFilter
{
    [StringLength(100)] public string? Search { get; init; }
    [StringLength(20)] public string? Gender { get; init; }
    [StringLength(100)] public string? Origin { get; init; }
    [Range(0, 120)] public int? AgeMin { get; init; }
    [Range(0, 120)] public int? AgeMax { get; init; }
    [Range(0, 300)] public int? HeightMin { get; init; }
    [Range(0, 300)] public int? HeightMax { get; init; }
    [Range(0, 500)] public int? WeightMin { get; init; }
    [Range(0, 500)] public int? WeightMax { get; init; }
}

internal static class ActorMappings
{
    public static ActorSummaryDto ToSummaryDto(this Actor a, DateOnly today) => new(
        a.ParticipantId, a.Participant.FirstName, a.Participant.LastName,
        AgeCalculator.AgeOn(a.DateOfBirth, today), a.Height, a.Weight, a.Origin, a.Gender);

    public static ActorDto ToDto(this Actor a, DateOnly today) => new(
        a.ParticipantId, a.Participant.FirstName, a.Participant.LastName,
        a.DateOfBirth, AgeCalculator.AgeOn(a.DateOfBirth, today),
        a.Height, a.Weight, a.Origin, a.Gender, a.Bio,
        a.Links.Select(l => new ActorLinkDto(l.Label, l.Url)).ToList(),
        a.RoleInterests.ToList());
}