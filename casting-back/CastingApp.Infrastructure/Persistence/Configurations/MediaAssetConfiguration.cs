using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class MediaAssetConfiguration : IEntityTypeConfiguration<MediaAsset>
{
    public void Configure(EntityTypeBuilder<MediaAsset> e)
    {
        e.ToTable("media_asset", t => t.HasCheckConstraint(
            "ck_media_asset_kind",
            "kind IN ('ProfilePicture','Headshot','FullBody','ProductionStill','Showreel')"));
        e.HasKey(m => m.Id);
        e.Property(m => m.Kind).HasConversion<string>().HasMaxLength(30);
        e.Property(m => m.Caption).HasMaxLength(140);
        e.Property(m => m.StorageKey).HasMaxLength(300).IsRequired();
        e.Property(m => m.ContentType).HasMaxLength(100).IsRequired();
        e.HasIndex(m => new { m.OwnerId, m.Kind }).HasDatabaseName("ix_media_asset_owner_kind");

        e.HasOne<Participant>().WithMany().HasForeignKey(m => m.OwnerId).OnDelete(DeleteBehavior.Cascade);
        
        e.HasMany<Participant>().WithOne().HasForeignKey(p => p.ProfilePictureId).OnDelete(DeleteBehavior.SetNull);
    }
}