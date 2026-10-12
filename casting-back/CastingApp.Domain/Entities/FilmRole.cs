using CastingApp.Domain.Enums;

namespace CastingApp.Domain.Entities;

public class FilmRole
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid FilmId { get; set; }    
    public Film Film { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public int? AgeMin { get; set; }
    public int? AgeMax { get; set; }
    public int? HeightMin { get; set; }
    public int? HeightMax { get; set; }
    public int? WeightMin { get; set; }
    public int? WeightMax { get; set; }
    public string? Gender { get; set; }
    public string? Origin { get; set; }
    public FilmRoleStatus Status { get; set; } = FilmRoleStatus.Open;
    public int RowVersion { get; set; }     // optimistic concurrency token

    public ICollection<RoleApplication> Applications { get; set; } = [];
}