using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Domain.Enums;

namespace CastingApp.Api.Auth;

public class CurrentUser(IHttpContextAccessor accessor) : ICurrentUser
{
    private System.Security.Claims.ClaimsPrincipal? Principal => accessor.HttpContext?.User;

    public bool IsAuthenticated => Principal?.Identity?.IsAuthenticated == true;

    public Guid Id => Guid.TryParse(Principal?.FindFirst("sub")?.Value, out var id)
        ? id
        : throw new UnauthorizedException("Not authenticated.");

    public ParticipantRole Role => Enum.TryParse<ParticipantRole>(Principal?.FindFirst("role")?.Value, out var role)
        ? role
        : throw new UnauthorizedException("Not authenticated.");
}