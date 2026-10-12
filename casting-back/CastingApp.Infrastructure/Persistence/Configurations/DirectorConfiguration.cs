using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class DirectorConfiguration : IEntityTypeConfiguration<Director>
{
    public void Configure(EntityTypeBuilder<Director> builder)
    {
        builder.ToTable("director");
        builder.HasKey(d => d.ParticipantId);
        builder.HasOne(d => d.Participant).WithOne(p => p.Director)
            .HasForeignKey<Director>(d => d.ParticipantId).OnDelete(DeleteBehavior.Cascade);

        builder.Property(d => d.Origin).HasMaxLength(100);
        builder.Property(d => d.Gender).HasMaxLength(20);
    }
}