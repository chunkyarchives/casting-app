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
        var recipients = new List<string> { application.ActorId.ToString() };
        if (application.ProposedById is { } proposerId)
            recipients.Add(proposerId.ToString());

        try
        {
            await hub.Clients
                .Users(recipients)
                .SendAsync(ChatEvents.ApplicationDecided, application, ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not push the decision for application {ApplicationId} in real time.", application.Id);
        }
    }

    public async Task ApplicationWithdrawnAsync(RoleApplicationDto application, Guid directorId, CancellationToken ct)
    {
        try
        {
            await hub.Clients
                .User(directorId.ToString())
                .SendAsync(ChatEvents.ApplicationWithdrawn, application, ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not push the withdrawal of application {ApplicationId} in real time.", application.Id);
        }
    }
}