using CastingApp.Domain.Enums;

namespace CastingApp.Domain.Entities;

public class Film
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid DirectorId { get; set; }
    public Director Director { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ContentRating { get; set; }
    public int? ReleaseYear { get; set; }
    public FilmStatus Status { get; set; } = FilmStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<FilmRole> Roles { get; set; } = [];
}
