using System.ComponentModel.DataAnnotations;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using CastingApp.Application.Services.Media;

namespace CastingApp.Application.DTOs.Auth;

public record RegisterRequest(
    [Required, EmailAddress, StringLength(256)] string Email,
    [Required, StringLength(100, MinimumLength = 8)] string Password,
    [Required, StringLength(100)] string FirstName,
    [Required, StringLength(100)] string LastName,
    [Required] ParticipantRole? Role) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // Admin nalog se ne pravi javnom registracijom, ovo hvata i nepostojeće brojeve u JSON-u
        if (Role is not (ParticipantRole.Actor or ParticipantRole.Director or ParticipantRole.CastingDirector))
            yield return new ValidationResult(
                "Role must be Actor, Director or CastingDirector.", new[] { nameof(Role) });
    }
}

public record LoginRequest([Required, StringLength(256)] string Email,[Required, StringLength(100)] string Password);

// ProfileComplete: false dok korisnik ne popuni obavezne podatke
public record MeDto(
    Guid Id, string Email, string FirstName, string LastName, ParticipantRole Role, bool ProfileComplete, string? ProfilePictureUrl = null);

// Token ne ide klijentu u telu odgovora: kontroler ga stavlja u cookie
public record AuthResult(MeDto Me, string Token, DateTime ExpiresAt);

internal static class AuthMappings
{
    public static MeDto ToMeDto(this Participant p) => new(
        p.Id, p.Email ?? string.Empty, p.FirstName, p.LastName, p.Role,
        p.Role == ParticipantRole.Admin || p.ProfileCompletedAt is not null,
        MediaUrls.ProfilePicture(p.Id, p.ProfilePictureId));
}