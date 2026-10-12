using CastingApp.Domain.Enums;

namespace CastingApp.Domain.Entities;

public class RoleApplication
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid FilmRoleId { get; set; }
    public FilmRole FilmRole { get; set; } = null!;
    public Guid ActorId { get; set; }
    public Actor Actor { get; set; } = null!;
    public Guid? ProposedById { get; set; }
    public CastingDirector? ProposedBy { get; set; }

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Proposed;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DecidedAt { get; set; }
}
