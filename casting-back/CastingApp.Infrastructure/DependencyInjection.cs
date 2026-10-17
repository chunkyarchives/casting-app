using CastingApp.Application.Abstractions;
using CastingApp.Domain.Entities;
using CastingApp.Infrastructure.Auth;
using CastingApp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using System.Text;

namespace CastingApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(config.GetConnectionString("Postgres"))
                   .UseSnakeCaseNamingConvention());

        services.AddSingleton<IConnectionMultiplexer>(_ =>
            ConnectionMultiplexer.Connect(config.GetConnectionString("Redis")!));

        services.AddIdentityCore<Participant>(o =>
        {
            o.User.RequireUniqueEmail = true;
            o.Password.RequiredLength = 8;
            o.Lockout.MaxFailedAccessAttempts = 5;
            o.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        })
        .AddEntityFrameworkStores<AppDbContext>();

        services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());

        var jwt = new JwtOptions
        {
            Key = config["Jwt:Key"] ?? string.Empty,
            Issuer = config["Jwt:Issuer"] ?? "CastingApp",
            Audience = config["Jwt:Audience"] ?? "CastingApp",
            ExpiresMinutes = int.TryParse(config["Jwt:ExpiresMinutes"], out var minutes) ? minutes : 15,
            RefreshTokenDays = int.TryParse(config["Jwt:RefreshTokenDays"], out var days) ? days : 30,
        };

        if (Encoding.UTF8.GetByteCount(jwt.Key) < 32)
            throw new InvalidOperationException(
                "Jwt:Key is missing or shorter than 32 bytes. Set it with: dotnet user-secrets set \"Jwt:Key\" \"<random value>\" --project CastingApp.Api");

        services.AddSingleton(jwt);
        services.AddSingleton<IJwtTokenService, JwtTokenService>();
        services.AddScoped<ISessionService, SessionService>();
        
        return services;
    }
}