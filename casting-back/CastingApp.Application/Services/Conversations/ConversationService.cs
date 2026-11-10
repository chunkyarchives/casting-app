using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Conversations;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Conversations;

public class ConversationService(IAppDbContext db, ICurrentUser currentUser) : IConversationService
{
    public async Task<PagedResult<ConversationDto>> ListAsync(Guid? actorId, Guid? directorId, int page, int pageSize, CancellationToken ct)
    {
        switch (currentUser.Role)
        {
            case ParticipantRole.Actor: actorId = currentUser.Id; break;
            case ParticipantRole.Director: directorId = currentUser.Id; break;
        }

        var query = db.Conversations.AsNoTracking();
        if (actorId is not null)
            query = query.Where(c => c.ActorId == actorId);
        if (directorId is not null)
            query = query.Where(c => c.DirectorId == directorId);

        var total = await query.CountAsync(ct);
        var conversations = await WithDetails(query)
            // Najsvežiji razgovori prvi: vreme poslednje poruke, a ako je nema, vreme pravljenja razgovora
            .OrderByDescending(c => c.Messages.Max(m => (DateTime?)m.SentAt) ?? c.CreatedAt)
            .ThenBy(c => c.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var ids = conversations.Select(c => c.Id).ToList();
        var unread = await UnreadFor(currentUser.Id)
            .Where(m => ids.Contains(m.ConversationId))
            .GroupBy(m => m.ConversationId)
            .Select(g => new { ConversationId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.ConversationId, x => x.Count, ct);

        return new PagedResult<ConversationDto>(
            conversations.Select(c => c.ToDto(unread.GetValueOrDefault(c.Id))).ToList(), page, pageSize, total);
    }

    public async Task<ConversationDto> GetAsync(Guid id, CancellationToken ct)
    {
        var conversation = await WithDetails(db.Conversations.AsNoTracking())
            .FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException(nameof(Conversation), id);

        if (!currentUser.IsAdmin() && currentUser.Id != conversation.ActorId && currentUser.Id != conversation.DirectorId)
            throw new ForbiddenException("You are not a participant of this conversation.");

        var unread = await UnreadFor(currentUser.Id).CountAsync(m => m.ConversationId == id, ct);
        return conversation.ToDto(unread);
    }

    public async Task<StartConversationResult> StartAsync(StartConversationRequest request, CancellationToken ct)
    {
        var directorId = currentUser.Id;  
        var actorId = request.ActorId;

        if (!await db.Actors.AnyAsync(a => a.ParticipantId == actorId, ct))
            throw new NotFoundException(nameof(Actor), actorId);

        if (!await db.Directors.AnyAsync(d => d.ParticipantId == directorId, ct))
            throw new NotFoundException(nameof(Director), directorId);

        if (await FindIdAsync(actorId, directorId, ct) is { } existingId)
            return new StartConversationResult(await GetAsync(existingId, ct), Created: false);

        var applied = await db.RoleApplications.AnyAsync(a => a.ActorId == actorId && a.FilmRole.Film.DirectorId == directorId, ct);
        if (!applied)
            throw new ForbiddenException("You can message only actors who applied for a role in one of your films.");

        db.Conversations.Add(new Conversation
        {
            ActorId = actorId,
            DirectorId = directorId
        });

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            // Unique indeks uq_conversation: paralelan zahtev je upravo napravio isti razgovor, vraćamo njega
            var raceId = await FindIdAsync(actorId, directorId, ct)
                ?? throw new ConflictException("The conversation could not be created. Try again.");
            return new StartConversationResult(await GetAsync(raceId, ct), Created: false);
        }

        var created = await FindIdAsync(actorId, directorId, ct);
        return new StartConversationResult(await GetAsync(created!.Value, ct), Created: true);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var conversation = await db.Conversations.FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException(nameof(Conversation), id);

        db.Conversations.Remove(conversation);   // poruke briše baza (ON DELETE CASCADE)
        await db.SaveChangesAsync(ct);
    }

        public async Task MarkReadAsync(Guid id, CancellationToken ct)
    {
        var viewerId = currentUser.Id;
        var conversation = await db.Conversations.FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException(nameof(Conversation), id);

        if (viewerId != conversation.ActorId && viewerId != conversation.DirectorId)
            throw new ForbiddenException("You are not a participant of this conversation.");

        var readAt = await db.Messages
            .Where(m => m.ConversationId == id)
            .MaxAsync(m => (DateTime?)m.SentAt, ct) ?? DateTime.UtcNow;

        if (viewerId == conversation.ActorId)
            conversation.ActorReadAt = readAt;
        else
            conversation.DirectorReadAt = readAt;

        await db.SaveChangesAsync(ct);
    }

    public async Task<UnreadCountDto> UnreadCountAsync(CancellationToken ct) => new(await UnreadFor(currentUser.Id).CountAsync(ct));

    private IQueryable<Message> UnreadFor(Guid viewerId) => db.Messages.AsNoTracking().Where(m =>
        m.SenderId != viewerId &&
            (m.Conversation.ActorId == viewerId
            ? m.Conversation.ActorReadAt == null || m.SentAt > m.Conversation.ActorReadAt
            : m.Conversation.DirectorId == viewerId
            && (m.Conversation.DirectorReadAt == null || m.SentAt > m.Conversation.DirectorReadAt)));

    private Task<Guid?> FindIdAsync(Guid actorId, Guid directorId, CancellationToken ct) =>
        db.Conversations.AsNoTracking()
            .Where(c => c.ActorId == actorId && c.DirectorId == directorId)
            .Select(c => (Guid?)c.Id)
            .FirstOrDefaultAsync(ct);

    // Imena učesnika + SAMO najnovija poruka svakog razgovora (filtrirani Include sa Take(1))
    private static IQueryable<Conversation> WithDetails(IQueryable<Conversation> query) => query
        .Include(c => c.Actor).ThenInclude(a => a.Participant)
        .Include(c => c.Director).ThenInclude(d => d.Participant)
        .Include(c => c.Messages.OrderByDescending(m => m.SentAt).ThenByDescending(m => m.Id).Take(1));
}