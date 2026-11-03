using CastingApp.Application.DTOs.Media;
using CastingApp.Application.Services.Media;
using CastingApp.Domain.Entities;

namespace CastingApp.Application.DTOs.Films;

internal static class FilmMappings
{
    public static FilmRoleDto ToDto(this FilmRole r) => new(
        r.Id, r.FilmId, r.Name, r.Description, r.AgeMin, r.AgeMax, r.HeightMin, r.HeightMax,
        r.WeightMin, r.WeightMax, r.Gender, r.Origin, r.Status, r.RowVersion,
        r.ConceptArt.OrderBy(m => m.CreatedAt).Select(m => m.ToItemDto()).ToList());

    public static FilmDto ToDto(this Film f) => new(
        f.Id, f.DirectorId, f.Title, f.Description, f.ContentRating, f.ReleaseYear, f.Status, f.CreatedAt,
        f.Roles.OrderBy(r => r.Name).Select(r => r.ToDto()).ToList(),
        MediaUrls.Media(f.PosterId));
}