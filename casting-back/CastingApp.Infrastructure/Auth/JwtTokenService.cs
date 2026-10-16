using System.Security.Claims;
using System.Text;
using CastingApp.Application.Abstractions;
using CastingApp.Domain.Entities;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace CastingApp.Infrastructure.Auth;

public class JwtTokenService(JwtOptions jwt) : IJwtTokenService
{
    public AccessToken CreateToken(Participant participant)
    {
        var expires = DateTime.UtcNow.AddMinutes(jwt.ExpiresMinutes);

        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = jwt.Issuer,
            Audience = jwt.Audience,
            Expires = expires,
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, participant.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, participant.Email ?? string.Empty),
                new Claim("role", participant.Role.ToString()),
                new Claim("name", $"{participant.FirstName} {participant.LastName}")
            }),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
                SecurityAlgorithms.HmacSha256)
        };

        return new AccessToken(new JsonWebTokenHandler().CreateToken(descriptor), expires);
    }
}