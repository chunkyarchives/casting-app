using CastingApp.Domain.Entities;

namespace CastingApp.Application.Abstractions;

public record AccessToken(string Value, DateTime ExpiresAt);

public interface IJwtTokenService
{
    AccessToken CreateToken(Participant participant);
}