using CastingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace CastingApp.Application.Abstractions;

public interface IAppDbContext
{
    DbSet<Actor> Actors { get; }
    DbSet<CrewMembership> CrewMemberships { get; }
    DbSet<Director> Directors { get; }
    DbSet<CastingDirector> CastingDirectors { get; }
    DbSet<Crew> Crews { get; }
    DbSet<Film> Films { get; }
    DbSet<FilmRole> FilmRoles { get; }
    DbSet<RoleApplication> RoleApplications { get; }
    DbSet<Conversation> Conversations { get; }
    DbSet<Message> Messages { get; }

    EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    DbSet<RefreshToken> RefreshTokens { get; }
}