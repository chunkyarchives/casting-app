using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class ParticipantConfiguration : IEntityTypeConfiguration<Participant>
{
    public void Configure(EntityTypeBuilder<Participant> builder)
    {
        builder.ToTable("participant", t => t.HasCheckConstraint(
            "ck_participant_role", "role IN ('Actor','Director','CastingDirector','Admin')"));

        builder.Property(p => p.UserName).HasMaxLength(64);
        builder.Property(p => p.Email).HasMaxLength(256);
        builder.Property(p => p.FirstName).HasMaxLength(100).IsRequired();
        builder.Property(p => p.LastName).HasMaxLength(100).IsRequired();
        builder.Property(p => p.Role).HasConversion<string>().HasMaxLength(20);

        builder.HasIndex(p => p.NormalizedEmail).IsUnique();
    }
}