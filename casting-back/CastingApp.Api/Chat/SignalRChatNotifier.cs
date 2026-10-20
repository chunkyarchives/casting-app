using CastingApp.Application.Abstractions;
using CastingApp.Application.DTOs.Conversations;
using Microsoft.AspNetCore.SignalR;

namespace CastingApp.Api.Chat;

public class SignalRChatNotifier(IHubContext<ChatHub> hub, ILogger<SignalRChatNotifier> logger) : IChatNotifier
{
    public async Task MessageSentAsync(MessageDto message, Guid actorId, Guid directorId, CancellationToken ct)
    {
        try
        {
            await hub.Clients
                .Users(new[] { actorId.ToString(), directorId.ToString() })
                .SendAsync(ChatEvents.MessageReceived, message, ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not push message {MessageId} in real time.", message.Id);
        }
    }
}