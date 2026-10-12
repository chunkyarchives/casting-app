namespace CastingApp.Domain.Entities;

public record ActorLink(string Label, string Url);

public class Actor
{
    public Guid ParticipantId { get; set; }          // PK and FK to Participant
    public Participant Participant { get; set; } = null!;

    public DateOnly? DateOfBirth { get; set; }
    public int? Weight { get; set; }
    public int? Height { get; set; }
    public string? Origin { get; set; }
    public string? Gender { get; set; }
    public string? Bio { get; set; }
    public List<ActorLink> Links { get; set; } = [];        // JSONB
    public List<string> RoleInterests { get; set; } = [];   // JSONB

    public ICollection<RoleApplication> Applications { get; set; } = [];
    public ICollection<Conversation> Conversations { get; set; } = [];
}