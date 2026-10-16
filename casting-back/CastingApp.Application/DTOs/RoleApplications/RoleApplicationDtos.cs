using CastingApp.Domain.Enums;

namespace CastingApp.Application.DTOs.RoleApplications;

public record RoleApplicationDto(
    Guid Id,
    Guid FilmRoleId,
    string FilmRoleName,
    Guid FilmId,
    Guid ActorId,
    string ActorName,
    Guid? ProposedById,        // null = glumac se prijavio sam; inače id castinг direktora
    ApplicationStatus Status,
    DateTime CreatedAt,
    DateTime? DecidedAt);

// Glumac salje prazno telo ({}), casting director salje ActorId glumca koga predlaze, ziveo dnd
public record CreateRoleApplicationRequest(Guid? ActorId);