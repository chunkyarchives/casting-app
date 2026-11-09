using CastingApp.Domain.Enums;

namespace CastingApp.Application.DTOs.Public;

public record PublicFilmDto(
    Guid Id,
    string Title,
    string? Description,
    string? ContentRating,
    int? ReleaseYear,
    string DirectorName,
    string? PosterUrl,
    int OpenRoles);

public record PublicRoleDto(
    Guid Id,
    string Name,
    string? Description,
    string? Gender,
    string? Origin,
    int? AgeMin,
    int? AgeMax,
    Guid FilmId,
    string FilmTitle,
    string? PosterUrl,
    int Applications);

public record PublicPersonDto(
    Guid Id,
    string FirstName,
    string LastName,
    ParticipantRole Role,
    string? ProfilePictureUrl,
    string? Origin,
    int? Age,
    string? Bio);