using CastingApp.Application.DTOs.Conversations;

namespace CastingApp.Application.Services.Conversations;

public interface IMessageService
{
    Task<MessageHistoryDto> ListAsync(Guid conversationId, DateTimeOffset? before, int limit, CancellationToken ct);
    Task<MessageDto> SendAsync(Guid conversationId, SendMessageRequest request, CancellationToken ct);
}