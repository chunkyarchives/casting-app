namespace CastingApp.Domain.Entities;

public class CastingDirector
{
    public Guid ParticipantId { get; set; }
    public Participant Participant { get; set; } = null!;

    public DateOnly? DateOfBirth { get; set; }
    public string? Gender { get; set; }

    public ICollection<CrewMembership> Memberships { get; set; } = [];
    public ICollection<RoleApplication> ProposedApplications { get; set; } = [];
}