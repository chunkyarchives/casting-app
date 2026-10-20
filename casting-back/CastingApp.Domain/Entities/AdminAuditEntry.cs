using CastingApp.Domain.Enums;

namespace CastingApp.Domain.Entities;

// Jedan red dnevnika admin akcija. Namerno nema stranih ključeva:
// dnevnik mora da preživi brisanje naloga i sadržaja na koje se odnosi.
public class AdminAuditEntry
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid AdminId { get; set; }
    public string AdminEmail { get; set; } = null!;     // kopija u trenutku akcije
    public AdminAction Action { get; set; }
    public string TargetType { get; set; } = null!;     // "Account", "Film", "Conversation"
    public Guid TargetId { get; set; }
    public string TargetLabel { get; set; } = null!;    // kopija: email, naslov filma, imena učesnika
    public string? Reason { get; set; }
    public DateTime CreatedAt { get; set; }
}