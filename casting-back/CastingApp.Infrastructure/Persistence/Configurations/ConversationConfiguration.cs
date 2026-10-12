using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
    public void Configure(EntityTypeBuilder<Conversation> builder)
    {
        builder.ToTable("conversation");
        builder.HasKey(c => c.Id);
        builder.HasIndex(c => new { c.ActorId, c.DirectorId })
            .IsUnique().HasDatabaseName("uq_conversation");

        builder.HasOne(c => c.Actor).WithMany(a => a.Conversations)
            .HasForeignKey(c => c.ActorId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(c => c.Director).WithMany(d => d.Conversations)
            .HasForeignKey(c => c.DirectorId).OnDelete(DeleteBehavior.Cascade);
    }
}