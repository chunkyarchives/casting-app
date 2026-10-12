using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class FilmRoleConfiguration : IEntityTypeConfiguration<FilmRole>
{
    public void Configure(EntityTypeBuilder<FilmRole> builder)
    {
        builder.ToTable("film_role", t => t.HasCheckConstraint(
            "ck_film_role_status", "status IN ('Open','Filled')"));

        builder.HasKey(r => r.Id);
        builder.Property(r => r.Name).HasMaxLength(200).IsRequired();
        builder.Property(r => r.Gender).HasMaxLength(20);
        builder.Property(r => r.Origin).HasMaxLength(100);
        builder.Property(r => r.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(r => r.RowVersion).IsConcurrencyToken().HasDefaultValue(0);

        builder.HasOne(r => r.Film).WithMany(f => f.Roles)
            .HasForeignKey(r => r.FilmId).OnDelete(DeleteBehavior.Cascade);
    }
}