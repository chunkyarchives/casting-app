using System.ComponentModel.DataAnnotations;

namespace CastingApp.Application.DTOs.Accounts;

public record UpdateVisibilityRequest(bool IsProfilePublic);

public record DeactivateAccountRequest(
    [Required] DateOnly? Until,
    [Required, StringLength(100)] string Password) : IValidatableObject
{
    public const int MaxDays = 365;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (Until is { } until && (until <= today || until > today.AddDays(MaxDays)))
            yield return new ValidationResult("Pick a day between tomorrow and one year from now.", new[] { nameof(Until) });
    }
}

public record DeleteAccountRequest([Required, StringLength(100)] string Password);