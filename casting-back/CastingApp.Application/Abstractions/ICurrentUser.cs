using CastingApp.Domain.Enums;

namespace CastingApp.Application.Abstractions;

public interface ICurrentUser
{
    bool IsAuthenticated { get; }
    Guid Id { get; }
    ParticipantRole Role { get; }
}