using CastingApp.Application.DTOs.Auth;

namespace CastingApp.Application.Services.Auth;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
    Task<MeDto> GetMeAsync();
}