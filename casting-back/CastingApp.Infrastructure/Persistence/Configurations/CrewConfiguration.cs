using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class CrewConfiguration : IEntityTypeConfiguration<Crew>
{
    public void Configure(EntityTypeBuilder<Crew> builder)
    {
        builder.ToTable("crew", t => t.HasCheckConstraint(
            "ck_crew_production_code", "production_code ~ '^[A-Z0-9]{6}$'"));

        builder.HasKey(c => c.Id);
        builder.Property(c => c.ProductionName).HasMaxLength(200).IsRequired();
        builder.Property(c => c.ProductionCode).HasMaxLength(6).IsRequired();
        builder.HasIndex(c => c.ProductionCode).IsUnique();

        // One crew per director
        builder.HasOne(c => c.Director).WithOne(d => d.Crew)
            .HasForeignKey<Crew>(c => c.DirectorId).OnDelete(DeleteBehavior.Restrict);
    }
}