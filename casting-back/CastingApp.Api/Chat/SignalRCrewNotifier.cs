using CastingApp.Application.Abstractions;
using CastingApp.Application.DTOs.Crews;
using Microsoft.AspNetCore.SignalR;

namespace CastingApp.Api.Chat;

public class SignalRCrewNotifier(IHubContext<ChatHub> hub, ILogger<SignalRCrewNotifier> logger) : ICrewNotifier
{
    public async Task MemberChangedAsync(CrewMemberChangeDto change, IReadOnlyCollection<Guid> recipients, CancellationToken ct)
    {
        try
        {
            await hub.Clients
                .Users(recipients.Select(id => id.ToString()).ToList())
                .SendAsync(ChatEvents.CrewMemberChanged, change, ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not push the crew change for {CrewId} in real time.", change.CrewId);
        }
    }
}