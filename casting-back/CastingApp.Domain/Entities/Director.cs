namespace CastingApp.Domain.Entities;

public class Director
{
    public Guid ParticipantId { get; set; }
    public Participant Participant { get; set; } = null!;

    public DateOnly? DateOfBirth { get; set; }
    public string? Origin { get; set; }
    public string? Bio { get; set; }
    public string? Gender { get; set; }

    public Crew? Crew { get; set; }
    public ICollection<Film> Films { get; set; } = [];
    public ICollection<Conversation> Conversations { get; set; } = [];
}