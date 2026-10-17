using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> e)
    {
        e.ToTable("refresh_token");
        e.HasKey(t => t.Id);
        e.Property(t => t.TokenHash).HasMaxLength(64).IsRequired();
        e.HasIndex(t => t.TokenHash).IsUnique().HasDatabaseName("uq_refresh_token_hash");
        e.HasIndex(t => t.FamilyId).HasDatabaseName("ix_refresh_token_family");
        e.HasIndex(t => t.ParticipantId).HasDatabaseName("ix_refresh_token_participant");

        // Brisanjem naloga brišu se i njegovi tokeni
        e.HasOne<Participant>().WithMany().HasForeignKey(t => t.ParticipantId).OnDelete(DeleteBehavior.Cascade);
    }
}