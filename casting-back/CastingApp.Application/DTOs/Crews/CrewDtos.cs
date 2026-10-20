using System.ComponentModel.DataAnnotations;
using CastingApp.Domain.Entities;

namespace CastingApp.Application.DTOs.Crews;

public record CrewSummaryDto(Guid Id, Guid DirectorId, string ProductionName, int MemberCount, DateTime CreatedAt);

public record CrewMemberDto(Guid CastingDirectorId, string FirstName, string LastName, DateTime JoinedAt);

// ProductionCode vide samo reditelj ekipe, njeni članovi i admin; za sve ostale je null
public record CrewDto(
    Guid Id,
    Guid DirectorId,
    string ProductionName,
    string? ProductionCode,
    DateTime CreatedAt,
    IReadOnlyList<CrewMemberDto> Members);

public record CreateCrewRequest([StringLength(200)] string ProductionName);
public record UpdateCrewRequest([StringLength(200)] string ProductionName);

public record JoinCrewRequest([RegularExpression("^[A-Za-z0-9]{6}$", ErrorMessage = "Production code must be 6 letters or digits.")] string ProductionCode);

internal static class CrewMappings
{
    public static CrewDto ToDto(this Crew c, bool includeCode = false) => new(
        c.Id, c.DirectorId, c.ProductionName, includeCode ? c.ProductionCode : null, c.CreatedAt,
        c.Memberships
            .OrderBy(m => m.JoinedAt)
            .Select(m => new CrewMemberDto(
                m.CastingDirectorId,
                m.CastingDirector.Participant.FirstName,
                m.CastingDirector.Participant.LastName,
                m.JoinedAt))
            .ToList());
}