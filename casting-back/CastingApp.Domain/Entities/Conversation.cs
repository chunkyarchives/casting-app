namespace CastingApp.Domain.Entities;

public class Conversation
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid ActorId { get; set; }
    public Actor Actor { get; set; } = null!;
    public Guid DirectorId { get; set; }
    public Director Director { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Message> Messages { get; set; } = [];
}