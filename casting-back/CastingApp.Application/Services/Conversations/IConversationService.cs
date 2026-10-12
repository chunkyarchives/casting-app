using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Conversations;

namespace CastingApp.Application.Services.Conversations;

public interface IConversationService
{
    Task<PagedResult<ConversationDto>> ListAsync(
        Guid? actorId, Guid? directorId, int page, int pageSize, CancellationToken ct);
    Task<ConversationDto> GetAsync(Guid id, CancellationToken ct);
    Task<StartConversationResult> StartAsync(StartConversationRequest request, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
}