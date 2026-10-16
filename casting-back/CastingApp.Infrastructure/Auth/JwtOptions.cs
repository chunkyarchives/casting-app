namespace CastingApp.Infrastructure.Auth;

public class JwtOptions
{
    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = "CastingApp";
    public string Audience { get; set; } = "CastingApp";
    public int ExpiresMinutes { get; set; } = 120;
}