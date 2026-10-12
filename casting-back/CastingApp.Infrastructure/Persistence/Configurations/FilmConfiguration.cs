using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class FilmConfiguration : IEntityTypeConfiguration<Film>
{
    public void Configure(EntityTypeBuilder<Film> builder)
    {
        builder.ToTable("film", t => t.HasCheckConstraint(
            "ck_film_status", "status IN ('Active','Archived')"));

        builder.HasKey(f => f.Id);
        builder.Property(f => f.Title).HasMaxLength(200).IsRequired();
        builder.Property(f => f.ContentRating).HasMaxLength(20);
        builder.Property(f => f.Status).HasConversion<string>().HasMaxLength(20);

        builder.HasOne(f => f.Director).WithMany(d => d.Films)
            .HasForeignKey(f => f.DirectorId).OnDelete(DeleteBehavior.Restrict);
    }
}