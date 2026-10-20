using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Conversations;
using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Conversations;

public class MessageService(IAppDbContext db, IChatNotifier notifier) : IMessageService
{
    private const int maxContentLength = 2000;
    private const int maxMessagesPerMinute = 20;   // po pošiljaocu, u jednom razgovoru

    public async Task<MessageHistoryDto> ListAsync(
        Guid conversationId, Guid viewerId, DateTimeOffset? before, int limit, CancellationToken ct)
    {
        await EnsureParticipantAsync(conversationId, viewerId, ct);

        var query = db.Messages.AsNoTracking().Where(m => m.ConversationId == conversationId);
        if (before is { } cursor)
        {
            var cursorUtc = cursor.UtcDateTime;   // Npgsql za timestamptz prima samo UTC
            query = query.Where(m => m.SentAt < cursorUtc);
        }

        // Tražimo limit + 1 poruku: ako stigne višak, znamo da postoje starije poruke
        var page = await query
            .OrderByDescending(m => m.SentAt)
            .ThenByDescending(m => m.Id)
            .Take(limit + 1)
            .ToListAsync(ct);

        var hasMore = page.Count > limit;
        var items = page.Take(limit).Select(m => m.ToDto()).ToList();

        return new MessageHistoryDto(items, hasMore, hasMore ? items[^1].SentAt : null);
    }

    public async Task<MessageDto> SendAsync(Guid conversationId, Guid senderId, string content, CancellationToken ct)
    {
        var text = (content ?? string.Empty).Trim();
        if (text.Length == 0 || text.Length > maxContentLength)
            throw new BadRequestException($"A message must have between 1 and {maxContentLength} characters.");

        var participants = await EnsureParticipantAsync(conversationId, senderId, ct);
        await EnsureCanSendAsync(conversationId, senderId, ct);

        // Postgres čuva mikrosekunde, a DateTime ima 100 ns: skraćujemo odmah da vrednost koju vraćamo bude identična onoj u bazi
        var now = DateTime.UtcNow;
        var message = new Message
        {
            ConversationId = conversationId,
            SenderId = senderId,
            Content = text,
            SentAt = new DateTime(now.Ticks - now.Ticks % 10, DateTimeKind.Utc)
        };

        db.Messages.Add(message);
        await db.SaveChangesAsync(ct);

        var dto = message.ToDto();

        // Poruka je već snimljena; notifier sam guta greške isporuke, pa slanje ne pada ako uživo ne stigne
        await notifier.MessageSentAsync(dto, participants.ActorId, participants.DirectorId, ct);

        return dto;
    }

    // Poruke jednog razgovora vide i šalju samo njegovi učesnici (ni admin ne čita tuđe poruke)
    private async Task<(Guid ActorId, Guid DirectorId)> EnsureParticipantAsync(
        Guid conversationId, Guid userId, CancellationToken ct)
    {
        var conversation = await db.Conversations.AsNoTracking()
            .Where(c => c.Id == conversationId)
            .Select(c => new { c.ActorId, c.DirectorId })
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException(nameof(Conversation), conversationId);

        if (userId != conversation.ActorId && userId != conversation.DirectorId)
            throw new ForbiddenException("Only the participants of a conversation can access its messages.");

        return (conversation.ActorId, conversation.DirectorId);
    }

    // Zaključan nalog i nalog sa nekompletnim profilom ne šalju; uz to ograničenje broja poruka u minuti
    private async Task EnsureCanSendAsync(Guid conversationId, Guid senderId, CancellationToken ct)
    {
        var now = DateTimeOffset.UtcNow;

        var sender = await db.Users.AsNoTracking()
            .Where(u => u.Id == senderId)
            .Select(u => new { u.ProfileCompletedAt, u.LockoutEnabled, u.LockoutEnd })
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException(nameof(Participant), senderId);

        if (sender.LockoutEnabled && sender.LockoutEnd > now)
            throw new ForbiddenException("This account is locked.");

        if (sender.ProfileCompletedAt is null)
            throw new ForbiddenException("Complete your profile before sending messages.");

        var since = DateTime.UtcNow.AddMinutes(-1);
        var recent = await db.Messages.CountAsync(
            m => m.ConversationId == conversationId && m.SenderId == senderId && m.SentAt > since, ct);

        if (recent >= maxMessagesPerMinute)
            throw new TooManyRequestsException("You are sending messages too fast. Try again in a moment.");
    }
}