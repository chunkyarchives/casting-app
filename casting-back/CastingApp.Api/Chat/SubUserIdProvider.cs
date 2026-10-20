using Microsoft.AspNetCore.SignalR;

namespace CastingApp.Api.Chat;

// SignalR podrazumevano traži NameIdentifier, a naš token nosi "sub" (MapInboundClaims je isključen)
public class SubUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection) => connection.User?.FindFirst("sub")?.Value;
}