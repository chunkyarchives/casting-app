using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class CastingDirectorConfiguration : IEntityTypeConfiguration<CastingDirector>
{
    public void Configure(EntityTypeBuilder<CastingDirector> builder)
    {
        builder.ToTable("casting_director");
        builder.HasKey(c => c.ParticipantId);
        builder.HasOne(c => c.Participant).WithOne(p => p.CastingDirector)
            .HasForeignKey<CastingDirector>(c => c.ParticipantId).OnDelete(DeleteBehavior.Cascade);

        builder.Property(c => c.Gender).HasMaxLength(20);
    }
}