using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace CastingApp.Domain.Entities;

public class Participant : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public ParticipantRole Role { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProfileCompletedAt { get; set; }
    public Actor? Actor { get; set; }
    public Director? Director { get; set; }
    public CastingDirector? CastingDirector { get; set; }
    public ICollection<Message> Messages { get; set; } = [];
}