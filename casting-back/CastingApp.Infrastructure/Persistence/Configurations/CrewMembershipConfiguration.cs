using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class CrewMembershipConfiguration : IEntityTypeConfiguration<CrewMembership>
{
    public void Configure(EntityTypeBuilder<CrewMembership> builder)
    {
        builder.ToTable("crew_membership");
        builder.HasKey(m => m.Id);
        builder.HasIndex(m => new { m.CrewId, m.CastingDirectorId })
            .IsUnique().HasDatabaseName("uq_crew_member");

        builder.HasOne(m => m.Crew).WithMany(c => c.Memberships)
            .HasForeignKey(m => m.CrewId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(m => m.CastingDirector).WithMany(c => c.Memberships)
            .HasForeignKey(m => m.CastingDirectorId).OnDelete(DeleteBehavior.Cascade);
    }
}