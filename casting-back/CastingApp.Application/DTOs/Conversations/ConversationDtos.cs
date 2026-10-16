using System.ComponentModel.DataAnnotations;
using CastingApp.Domain.Entities;

namespace CastingApp.Application.DTOs.Conversations;

public record MessageDto(Guid Id, Guid ConversationId, Guid SenderId, string Content, DateTime SentAt);

public record LastMessageDto(Guid SenderId, string Preview, DateTime SentAt);

public record ConversationDto(
    Guid Id,
    Guid ActorId,
    string ActorName,
    Guid DirectorId,
    string DirectorName,
    DateTime CreatedAt,
    LastMessageDto? LastMessage);

public record MessageHistoryDto(IReadOnlyList<MessageDto> Items, bool HasMore, DateTime? NextBefore);

public record StartConversationRequest(Guid ActorId);

public record StartConversationResult(ConversationDto Conversation, bool Created);

public record SendMessageRequest([Required, StringLength(2000)] string Content);

internal static class ConversationMappings
{
    private const int previewLength = 140;

    public static MessageDto ToDto(this Message m) =>
        new(m.Id, m.ConversationId, m.SenderId, m.Content, m.SentAt);

    public static ConversationDto ToDto(this Conversation c)
    {
        var last = c.Messages.FirstOrDefault();

        return new ConversationDto(
            c.Id,
            c.ActorId, FullName(c.Actor.Participant),
            c.DirectorId, FullName(c.Director.Participant),
            c.CreatedAt,
            last is null ? null : new LastMessageDto(last.SenderId, Preview(last.Content), last.SentAt));
    }

    private static string FullName(Participant p) => $"{p.FirstName} {p.LastName}";

    private static string Preview(string content) =>
        content.Length <= previewLength ? content : content[..previewLength] + "…";
}