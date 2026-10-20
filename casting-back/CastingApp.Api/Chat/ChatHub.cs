using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Conversations;
using CastingApp.Application.Services.Conversations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CastingApp.Api.Chat;

public static class ChatEvents
{
    public const string MessageReceived = "MessageReceived";
}

[Authorize(Roles = AppRoles.ActorOrDirector)]
public class ChatHub(IMessageService messages) : Hub
{
    // Isti servis kao REST endpoint, pa ista pravila: učesnik razgovora, nije zaključan, profil kompletan, ograničenje po minutu
    public async Task<MessageDto> SendMessage(Guid conversationId, string content)
    {
        if (!Guid.TryParse(Context.UserIdentifier, out var senderId))
            throw new HubException("Not authenticated.");

        try
        {
            return await messages.SendAsync(conversationId, senderId, content, Context.ConnectionAborted);
        }
        catch (Exception ex) when (ex is NotFoundException or ForbiddenException or BadRequestException or ConflictException or TooManyRequestsException or UnauthorizedException)
        {
            throw new HubException(ex.Message);
        }
    }
}