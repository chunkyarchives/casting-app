using System.ComponentModel.DataAnnotations;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.DTOs.Films;

public record FilmSummaryDto(
    Guid Id,
    Guid DirectorId,
    string Title,
    string? ContentRating,
    int? ReleaseYear,
    FilmStatus Status,
    DateTime CreatedAt,
    int RoleCount);

public record FilmDto(
    Guid Id,
    Guid DirectorId,
    string Title,
    string? Description,
    string? ContentRating,
    int? ReleaseYear,
    FilmStatus Status,
    DateTime CreatedAt,
    IReadOnlyList<FilmRoleDto> Roles);

public record CreateFilmRequest(
    Guid DirectorId,    // Temporal: kad uvedemo prijavu, ovo dolazi iz tokena, ne iz tela zahteva
    [StringLength(200)] string Title,
    [StringLength(4000)] string? Description,
    [StringLength(20)] string? ContentRating,
    [Range(1888, 2100)] int? ReleaseYear);

public record UpdateFilmRequest(
    [StringLength(200)] string Title,
    [StringLength(4000)] string? Description,
    [StringLength(20)] string? ContentRating,
    [Range(1888, 2100)] int? ReleaseYear,
    FilmStatus Status);