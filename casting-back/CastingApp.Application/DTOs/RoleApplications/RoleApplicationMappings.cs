using CastingApp.Application.Services.Media;
using CastingApp.Domain.Entities;

namespace CastingApp.Application.DTOs.RoleApplications;

internal static class ApplicationMappings
{
    public static IQueryable<RoleApplicationDto> ProjectToDto(this IQueryable<RoleApplication> query) =>
        query.Select(a => new RoleApplicationDto(
            a.Id,
            a.FilmRoleId,
            a.FilmRole.Name,
            MediaUrls.Media(a.FilmRole.ConceptArt.OrderBy(m => m.CreatedAt).Select(m => (Guid?)m.Id).FirstOrDefault()),
            a.FilmRole.FilmId,
            a.FilmRole.Film.Title,
            a.ActorId,
            a.Actor.Participant.FirstName + " " + a.Actor.Participant.LastName,
            a.ProposedById,
            a.ProposedBy == null ? null : a.ProposedBy.Participant.FirstName + " " + a.ProposedBy.Participant.LastName,
            a.Status,
            a.CreatedAt,
            a.DecidedAt));
}