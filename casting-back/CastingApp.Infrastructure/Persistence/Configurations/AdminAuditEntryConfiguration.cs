using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class AdminAuditEntryConfiguration : IEntityTypeConfiguration<AdminAuditEntry>
{
    public void Configure(EntityTypeBuilder<AdminAuditEntry> e)
    {
        e.ToTable("admin_audit", t => t.HasCheckConstraint(
            "ck_admin_audit_action",
            "action IN ('LockAccount','UnlockAccount','ForceLogout','DeleteAccount','DeleteFilm','DeleteConversation')"));
        e.HasKey(a => a.Id);
        e.Property(a => a.AdminEmail).HasMaxLength(256).IsRequired();
        e.Property(a => a.Action).HasConversion<string>().HasMaxLength(30);
        e.Property(a => a.TargetType).HasMaxLength(30).IsRequired();
        e.Property(a => a.TargetLabel).HasMaxLength(300).IsRequired();
        e.Property(a => a.Reason).HasMaxLength(600);
        e.HasIndex(a => a.CreatedAt).HasDatabaseName("ix_admin_audit_created_at");
        e.HasIndex(a => a.TargetId).HasDatabaseName("ix_admin_audit_target");
    }
}