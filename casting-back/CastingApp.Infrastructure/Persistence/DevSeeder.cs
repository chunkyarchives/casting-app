using CastingApp.Domain.Entities;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CastingApp.Infrastructure.Persistence;

public static class DevSeeder
{
    private const string devPassword = "Test1234!";

    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var users = scope.ServiceProvider.GetRequiredService<UserManager<Participant>>();

        if (await db.Users.AnyAsync()) return;  

        await CreateUser(users, "admin@casting.test", "Ada", "Admin", ParticipantRole.Admin);
        var director = await CreateUser(users, "director@casting.test", "Dara", "Director", ParticipantRole.Director);
        var castingDirector = await CreateUser(users, "casting@casting.test", "Cara", "Casting", ParticipantRole.CastingDirector);
        var actor1 = await CreateUser(users, "actor1@casting.test", "Aleksa", "Actor", ParticipantRole.Actor);
        var actor2 = await CreateUser(users, "actor2@casting.test", "Mila", "Actress", ParticipantRole.Actor);

        db.Directors.Add(new Director { ParticipantId = director.Id, Origin = "Serbia" });
        db.CastingDirectors.Add(new CastingDirector { ParticipantId = castingDirector.Id });
        db.Actors.Add(new Actor
        {
            ParticipantId = actor1.Id, Height = 182, Weight = 78, Origin = "Serbia", Gender = "Male",
            Bio = "FDU Student", RoleInterests = ["Drama", "Thriller"]
        });
        db.Actors.Add(new Actor
        {
            ParticipantId = actor2.Id, Height = 168, Weight = 58, Origin = "United States", Gender = "Female",
            Bio = "Film and TV.", RoleInterests = ["Comedy"]
        });

        var crew = new Crew { DirectorId = director.Id, ProductionName = "Test Production", ProductionCode = "CAST01" };
        db.Crews.Add(crew);
        db.CrewMemberships.Add(new CrewMembership { CrewId = crew.Id, CastingDirectorId = castingDirector.Id });

        var film = new Film { DirectorId = director.Id, Title = "Test Film", ReleaseYear = 2027, ContentRating = "PG-13" };
        film.Roles.Add(new FilmRole { Name = "Lead", AgeMin = 25, AgeMax = 40, Gender = "Male" });
        film.Roles.Add(new FilmRole { Name = "Detective", AgeMin = 30, AgeMax = 50 });
        db.Films.Add(film);

        await db.SaveChangesAsync();
    }

    private static async Task<Participant> CreateUser(
        UserManager<Participant> users, string email, string firstName, string lastName, ParticipantRole role)
    {
        var participant = new Participant
        {
            Id = Guid.CreateVersion7(),
            UserName = email.Split('@')[0],
            Email = email,
            EmailConfirmed = true,
            FirstName = firstName,
            LastName = lastName,
            Role = role
        };

        var result = await users.CreateAsync(participant, devPassword);  
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join("; ", result.Errors.Select(e => e.Description)));

        return participant;
    }
}