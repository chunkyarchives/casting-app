using CastingApp.Application.DTOs.Films;
using System.ComponentModel.DataAnnotations;
using CastingApp.Domain.Enums;

namespace CastingApp.Application.DTOs.Admin;

public record AdminAccountDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    ParticipantRole Role,
    bool ProfileComplete,
    bool Locked,
    DateTime CreatedAt);

public record AdminAccountDetailDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    ParticipantRole Role,
    bool ProfileComplete,
    DateTime? ProfileCompletedAt,
    DateTime CreatedAt,
    bool Locked,
    DateTimeOffset? LockedUntil,      // null kod trajnog zaključavanja ili kad nije zaključan
    string? LockReason,
    DateTime? LastActiveAt,           // poslednji izdati refresh token
    int ActiveSessions,
    int Films,
    int Applications,
    int Conversations,
    int MediaFiles,
    long MediaBytes);

public record LockAccountRequest(
    [StringLength(500, MinimumLength = 3)] string Reason,
    DateTime? Until);              

public record ForceLogoutResult(int SessionsEnded);

public record AdminFilmDto(
    Guid Id,
    string Title,
    FilmStatus Status,
    Guid DirectorId,
    string DirectorName,
    int RoleCount,
    DateTime CreatedAt,
    string? PosterUrl);

public record AdminFilmDetailDto(
    FilmDto Film,
    string DirectorName,
    IReadOnlyList<RoleApplicationCounts> Applications);

public record RoleApplicationCounts(Guid RoleId, int Proposed, int Accepted, int Rejected);

public record AdminConversationDto(
    Guid Id,
    Guid ActorId,
    string ActorName,
    Guid DirectorId,
    string DirectorName,
    int MessageCount);

public record TimelinePointDto(DateOnly Date, int Registrations, int Films, int Messages);

public record AuditEntryDto(
    Guid Id,
    Guid AdminId,
    string AdminEmail,
    AdminAction Action,
    string TargetType,
    Guid TargetId,
    string TargetLabel,
    string? Reason,
    DateTime CreatedAt);

public record AccountStats(int Total, int Actors, int Directors, int CastingDirectors, int Admins, int Locked, int IncompleteProfiles);
public record FilmStats(int Total, int Active, int Archived, int OpenRoles, int FilledRoles);
public record ApplicationStats(int Total, int Proposed, int Accepted, int Rejected);
public record ChatStats(int Conversations, int Messages);
public record MediaStats(int Files, long TotalBytes);

public record AdminStatsDto(
    AccountStats Accounts,
    FilmStats Films,
    ApplicationStats Applications,
    ChatStats Chat,
    MediaStats Media);

public record AccountListFilter(
    string? Search,
    IReadOnlyCollection<ParticipantRole> Roles,
    bool? Locked,
    bool? ProfileComplete);

public record CrewListFilter(string? Search, bool? HasFilms, bool? HasMembers);

public record AdminCrewDto(
    Guid Id,
    string ProductionName,
    string ProductionCode,
    Guid DirectorId,
    string DirectorName,
    int MemberCount,
    int FilmCount,            
    DateTime CreatedAt);

public record AdminCrewMemberDto(Guid CastingDirectorId, string FirstName, string LastName, string Email, DateTime JoinedAt);

public record AdminCrewDetailDto(
    Guid Id,
    string ProductionName,
    string ProductionCode,
    DateTime CreatedAt,
    Guid DirectorId,
    string DirectorName,
    string DirectorEmail,
    IReadOnlyList<AdminCrewMemberDto> Members,
    IReadOnlyList<AdminFilmDto> Films);

public record CrewCodeResult(string ProductionCode);