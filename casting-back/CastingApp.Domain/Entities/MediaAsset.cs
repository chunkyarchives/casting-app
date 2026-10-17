using CastingApp.Domain.Enums;

namespace CastingApp.Domain.Entities;

public class MediaAsset
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid OwnerId { get; set; }
    public MediaKind Kind { get; set; }
    public string? Caption { get; set; }          // opcioni naziv ("Drama showreel 2026")
    public string StorageKey { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public long SizeBytes { get; set; }
    public DateTime CreatedAt { get; set; }
}