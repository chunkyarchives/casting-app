using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Auth;
using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Auth;

public class AuthService(
    UserManager<Participant> users,
    IJwtTokenService tokens,
    ICurrentUser currentUser) : IAuthService
{
    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        var role = request.Role!.Value;  
        var id = Guid.CreateVersion7();

        var participant = new Participant
        {
            Id = id,
            UserName = id.ToString("N"),  
            Email = request.Email.Trim(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Role = role
        };

        switch (role)
        {
            case ParticipantRole.Actor: participant.Actor = new Actor(); break;
            case ParticipantRole.Director: participant.Director = new Director(); break;
            case ParticipantRole.CastingDirector: participant.CastingDirector = new CastingDirector(); break;
        }

        IdentityResult result;
        try
        {
            result = await users.CreateAsync(participant, request.Password);
        }
        catch (DbUpdateException)
        {
            throw new ConflictException("An account with this email already exists.");
        }

        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.Code is "DuplicateEmail" or "DuplicateUserName"))
                throw new ConflictException("An account with this email already exists.");

            throw new BadRequestException(string.Join(" ", result.Errors.Select(e => e.Description)));
        }

        return CreateResult(participant);
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var user = await users.FindByEmailAsync(request.Email.Trim())
            ?? throw InvalidCredentials();

        if (await users.IsLockedOutAsync(user))
            throw new UnauthorizedException("The account is temporarily locked after too many failed attempts. Try again later.");

        if (!await users.CheckPasswordAsync(user, request.Password))
        {
            await users.AccessFailedAsync(user);  
            throw InvalidCredentials();
        }

        await users.ResetAccessFailedCountAsync(user);
        return CreateResult(user);
    }

    public async Task<MeDto> GetMeAsync()
    {
        var user = await users.FindByIdAsync(currentUser.Id.ToString())
            ?? throw new UnauthorizedException("The account no longer exists.");

        return user.ToMeDto();
    }

    private AuthResult CreateResult(Participant participant)
    {
        var token = tokens.CreateToken(participant);
        return new AuthResult(participant.ToMeDto(), token.Value, token.ExpiresAt);
    }

    private static UnauthorizedException InvalidCredentials() => new("Invalid email or password.");
}