namespace CastingApp.Domain.Entities;

public class Crew
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid DirectorId { get; set; }
    public Director Director { get; set; } = null!;

    public string ProductionName { get; set; } = string.Empty;
    public string ProductionCode { get; set; } = string.Empty;   // 6 chars, A-Z0-9
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CrewMembership> Memberships { get; set; } = [];
}
