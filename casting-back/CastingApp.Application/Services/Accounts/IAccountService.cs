using CastingApp.Application.DTOs.Accounts;
using CastingApp.Application.DTOs.Auth;

namespace CastingApp.Application.Services.Accounts;

public interface IAccountService
{
    Task<MeDto> UpdateVisibilityAsync(UpdateVisibilityRequest request, CancellationToken ct);
    Task DeactivateAsync(DeactivateAccountRequest request, CancellationToken ct);
    Task DeleteAsync(DeleteAccountRequest request, CancellationToken ct);
}