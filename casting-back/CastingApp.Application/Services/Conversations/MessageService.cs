using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Conversations;
using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Conversations;

public class MessageService(IAppDbContext db) : IMessageService
{
    public async Task<MessageHistoryDto> ListAsync(
        Guid conversationId, DateTimeOffset? before, int limit, CancellationToken ct)
    {
        if (!await db.Conversations.AnyAsync(c => c.Id == conversationId, ct))
            throw new NotFoundException(nameof(Conversation), conversationId);

        var query = db.Messages.AsNoTracking().Where(m => m.ConversationId == conversationId);
        if (before is { } cursor)
        {
            var cursorUtc = cursor.UtcDateTime;   // Npgsql za timestamptz prima samo UTC
            query = query.Where(m => m.SentAt < cursorUtc);
        }

        var page = await query
            .OrderByDescending(m => m.SentAt)
            .ThenByDescending(m => m.Id)
            .Take(limit + 1)
            .ToListAsync(ct);

        var hasMore = page.Count > limit;
        var items = page.Take(limit).Select(m => m.ToDto()).ToList();

        return new MessageHistoryDto(items, hasMore, hasMore ? items[^1].SentAt : null);
    }

    public async Task<MessageDto> SendAsync(Guid conversationId, SendMessageRequest request, CancellationToken ct)
    {
        var conversation = await db.Conversations.AsNoTracking()
            .Where(c => c.Id == conversationId)
            .Select(c => new { c.ActorId, c.DirectorId })
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException(nameof(Conversation), conversationId);

        if (request.SenderId != conversation.ActorId && request.SenderId != conversation.DirectorId)
            throw new ForbiddenException("Only the participants of a conversation can send messages in it.");

        // Postgres čuva mikrosekunde, a DateTime ima 100 ns: skraćujemo odmah da vrednost
        var now = DateTime.UtcNow;
        var message = new Message
        {
            ConversationId = conversationId,
            SenderId = request.SenderId,
            Content = request.Content.Trim(),
            SentAt = new DateTime(now.Ticks - now.Ticks % 10, DateTimeKind.Utc)
        };

        db.Messages.Add(message);
        await db.SaveChangesAsync(ct);

        return message.ToDto();
    }
}