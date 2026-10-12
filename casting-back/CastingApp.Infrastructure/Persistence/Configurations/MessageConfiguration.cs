using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CastingApp.Infrastructure.Persistence.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("message");
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Content).IsRequired();
        builder.HasIndex(m => new { m.ConversationId, m.SentAt });   // chat history paging

        builder.HasOne(m => m.Conversation).WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(m => m.Sender).WithMany(p => p.Messages)
            .HasForeignKey(m => m.SenderId).OnDelete(DeleteBehavior.Cascade);
    }
}