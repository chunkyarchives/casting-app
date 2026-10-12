using System.ComponentModel.DataAnnotations;
using CastingApp.Domain.Entities;

namespace CastingApp.Application.DTOs.Crews;

public record CrewSummaryDto(Guid Id, Guid DirectorId, string ProductionName, int MemberCount, DateTime CreatedAt);

public record CrewMemberDto(Guid CastingDirectorId, string FirstName, string LastName, DateTime JoinedAt);

// ProductionCode je ovde; kad uvedemo autorizaciju, vide ga samo reditelj i članovi ekipe
public record CrewDto(
    Guid Id,
    Guid DirectorId,
    string ProductionName,
    string ProductionCode,
    DateTime CreatedAt,
    IReadOnlyList<CrewMemberDto> Members);

// temporal: DirectorId i CastingDirectorId kasnije dolaze iz tokena, ne iz tela zahteva
public record CreateCrewRequest(Guid DirectorId, [StringLength(200)] string ProductionName);

public record UpdateCrewRequest([StringLength(200)] string ProductionName);

public record JoinCrewRequest(
    [RegularExpression("^[A-Za-z0-9]{6}$", ErrorMessage = "Production code must be 6 letters or digits.")]
    string ProductionCode,
    Guid CastingDirectorId);

internal static class CrewMappings
{
    public static CrewDto ToDto(this Crew c) => new(
        c.Id, c.DirectorId, c.ProductionName, c.ProductionCode, c.CreatedAt,
        c.Memberships
            .OrderBy(m => m.JoinedAt)
            .Select(m => new CrewMemberDto(
                m.CastingDirectorId,
                m.CastingDirector.Participant.FirstName,
                m.CastingDirector.Participant.LastName,
                m.JoinedAt))
            .ToList());
}