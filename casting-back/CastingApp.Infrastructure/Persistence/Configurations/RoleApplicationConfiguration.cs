using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class RoleApplicationConfiguration : IEntityTypeConfiguration<RoleApplication>
{
    public void Configure(EntityTypeBuilder<RoleApplication> builder)
    {
        builder.ToTable("application", t => t.HasCheckConstraint(
            "ck_application_status", "status IN ('Proposed','Accepted','Rejected')"));

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Status).HasConversion<string>().HasMaxLength(20);

        // An actor can be proposed for a role only once
        builder.HasIndex(a => new { a.FilmRoleId, a.ActorId })
            .IsUnique().HasDatabaseName("uq_application");

        // At most ONE accepted application per role (partial unique index)
        builder.HasIndex(a => a.FilmRoleId)
            .IsUnique().HasFilter("status = 'Accepted'")
            .HasDatabaseName("uq_application_one_accepted");

        builder.HasOne(a => a.FilmRole).WithMany(r => r.Applications)
            .HasForeignKey(a => a.FilmRoleId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(a => a.Actor).WithMany(x => x.Applications)
            .HasForeignKey(a => a.ActorId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(a => a.ProposedBy).WithMany(c => c.ProposedApplications)
            .HasForeignKey(a => a.ProposedById).OnDelete(DeleteBehavior.SetNull);
    }
}