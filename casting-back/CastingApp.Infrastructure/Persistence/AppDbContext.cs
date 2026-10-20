using CastingApp.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CastingApp.Application.Abstractions;

namespace CastingApp.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityUserContext<Participant, Guid>(options), IAppDbContext
{
    public DbSet<Actor> Actors => Set<Actor>();
    public DbSet<Director> Directors => Set<Director>();
    public DbSet<CastingDirector> CastingDirectors => Set<CastingDirector>();
    public DbSet<Crew> Crews => Set<Crew>();
    public DbSet<CrewMembership> CrewMemberships => Set<CrewMembership>();
    public DbSet<Film> Films => Set<Film>();
    public DbSet<FilmRole> FilmRoles => Set<FilmRole>();
    public DbSet<RoleApplication> RoleApplications => Set<RoleApplication>();
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<AdminAuditEntry> AdminAudit => Set<AdminAuditEntry>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);  
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        builder.Entity<IdentityUserClaim<Guid>>().ToTable("participant_claim");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("participant_login");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("participant_token");
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<FilmRole>()
                     .Where(e => e.State == EntityState.Modified))
        {
            entry.Entity.RowVersion++;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}