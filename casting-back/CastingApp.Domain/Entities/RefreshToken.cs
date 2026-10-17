namespace CastingApp.Domain.Entities;

// Refresh token jedne prijave. Čuva se samo SHA-256 heš, nikad sam token.
public class RefreshToken
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid ParticipantId { get; set; }
    public Guid FamilyId { get; set; }           // svi tokeni jedne prijave (lanac rotacije) dele isti FamilyId
    public string TokenHash { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }     // null = još važi
}