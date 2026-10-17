using CastingApp.Application.Services.Actors;
using CastingApp.Application.Services.Directors;
using CastingApp.Application.Services.CastingDirectors;
using CastingApp.Application.Services.Crews;
using CastingApp.Application.Services.Films;
using CastingApp.Application.Services.Auth;
using CastingApp.Application.Services.Conversations;
using CastingApp.Application.Services.Media;
using CastingApp.Application.Services.RoleApplications;
using Microsoft.Extensions.DependencyInjection;

namespace CastingApp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IActorService, ActorService>();
        services.AddScoped<IDirectorService, DirectorService>();
        services.AddScoped<ICastingDirectorService, CastingDirectorService>();
        services.AddScoped<ICrewService, CrewService>();
        services.AddScoped<IFilmService, FilmService>();
        services.AddScoped<IFilmRoleService, FilmRoleService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IConversationService, ConversationService>();
        services.AddScoped<IMessageService, MessageService>();
        services.AddScoped<IMediaService, MediaService>();
        services.AddScoped<IRoleApplicationService, RoleApplicationService>();
        return services;
    }
}