using CastingApp.Application.DTOs.Conversations;

namespace CastingApp.Application.Abstractions;
// Application ne zna za SignalR: samo javlja da je poruka poslata, a Api je isporučuje klijentima
public interface IChatNotifier
{
    Task MessageSentAsync(MessageDto message, Guid actorId, Guid directorId, CancellationToken ct);
}