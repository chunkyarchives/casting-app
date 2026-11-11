using CastingApp.Application.Abstractions;
using CastingApp.Application.DTOs.RoleApplications;
using Microsoft.AspNetCore.SignalR;

namespace CastingApp.Api.Chat;

public class SignalRApplicationNotifier(IHubContext<ChatHub> hub, ILogger<SignalRApplicationNotifier> logger) : IApplicationNotifier
{
    public async Task ApplicationCreatedAsync(RoleApplicationDto application, Guid directorId, CancellationToken ct)
    {
        try
        {
            await hub.Clients
                .User(directorId.ToString())
                .SendAsync(ChatEvents.ApplicationReceived, application, ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not push the application {ApplicationId} in real time.", application.Id);
        }
    }

    public async Task ApplicationDecidedAsync(RoleApplicationDto application, CancellationToken ct)
    {
        try
        {
            await hub.Clients
                .User(application.ActorId.ToString())
                .SendAsync(ChatEvents.ApplicationDecided, application, ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not push the decision for application {ApplicationId} in real time.", application.Id);
        }
    }
}