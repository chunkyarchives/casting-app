using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CastingApp.Infrastructure.Persistence;

// Pravi prvog admina iz konfiguracije (Admin:Email, Admin:Password), u svim okruženjima
// postojeći nalog se nikad ne menja: ni lozinka, ni uloga
public static class AdminBootstrapper
{
    public static async Task EnsureAsync(IServiceProvider services, IConfiguration config)
    {
        var email = config["Admin:Email"]?.Trim();
        var password = config["Admin:Password"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrEmpty(password))
            return;   // nije podešeno, ništa se ne radi

        using var scope = services.CreateScope();
        var users = scope.ServiceProvider.GetRequiredService<UserManager<Participant>>();
        var log = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("AdminBootstrapper");

        var existing = await users.FindByEmailAsync(email);
        if (existing is not null)
        {
            if (existing.Role != ParticipantRole.Admin)
                log.LogWarning("Admin:Email belongs to an existing non-admin account. No admin was created.");
            return;
        }

        var admin = new Participant
        {
            Id = Guid.CreateVersion7(),
            UserName = email,   // ceo email, da ne dođe do sudara sa korisničkim imenima iz razvojnog seedera
            Email = email,
            EmailConfirmed = true,
            FirstName = config["Admin:FirstName"] is { Length: > 0 } first ? first : "Site",
            LastName = config["Admin:LastName"] is { Length: > 0 } last ? last : "Admin",
            Role = ParticipantRole.Admin,
            ProfileCompletedAt = DateTime.UtcNow
        };

        var result = await users.CreateAsync(admin, password);
        if (!result.Succeeded)
            throw new InvalidOperationException(
                "Could not create the admin account: " + string.Join("; ", result.Errors.Select(e => e.Description)));

        log.LogInformation("Admin account created from configuration.");
    }
}