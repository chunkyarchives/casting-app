using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class ActorConfiguration : IEntityTypeConfiguration<Actor>
{
    public void Configure(EntityTypeBuilder<Actor> builder)
    {
        builder.ToTable("actor");
        builder.HasKey(a => a.ParticipantId);
        builder.HasOne(a => a.Participant).WithOne(p => p.Actor)
            .HasForeignKey<Actor>(a => a.ParticipantId).OnDelete(DeleteBehavior.Cascade);

        builder.Property(a => a.Origin).HasMaxLength(100);
        builder.Property(a => a.Gender).HasMaxLength(20);
        builder.Property(a => a.Links).HasJsonbConversion();
        builder.Property(a => a.RoleInterests).HasJsonbConversion();
    }
}