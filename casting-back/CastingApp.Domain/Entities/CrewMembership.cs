namespace CastingApp.Domain.Entities;

public class CrewMembership
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid CrewId { get; set; }
    public Crew Crew { get; set; } = null!;
    public Guid CastingDirectorId { get; set; }
    public CastingDirector CastingDirector { get; set; } = null!;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}