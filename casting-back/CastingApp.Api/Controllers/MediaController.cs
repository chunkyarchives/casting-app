using System.ComponentModel.DataAnnotations;
using CastingApp.Api.RateLimiting;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Media;
using CastingApp.Application.Services.Media;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Net.Http.Headers;
using CastingApp.Api.Filters;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api")]
public class MediaController(IMediaService media) : ControllerBase
{
    private const string PublicMediaCache = "public, max-age=3600";
    private const long ShowreelRequestLimit = 210L * 1024 * 1024;

    [HttpPut("me/profile-picture")]
    [EnableRateLimiting(RateLimitPolicies.Upload)]
    public async Task<ActionResult<ProfilePictureDto>> UploadProfilePicture(IFormFile file, CancellationToken ct)
    {
        await using var stream = file.OpenReadStream();
        return Ok(await media.SetProfilePictureAsync(stream, file.Length, ct));
    }

    [HttpDelete("me/profile-picture")]
    public async Task<IActionResult> DeleteProfilePicture(CancellationToken ct)
    {
        await media.DeleteProfilePictureAsync(ct);
        return NoContent();
    }

    [HttpGet("participants/{id:guid}/profile-picture")]
    public async Task<IActionResult> GetProfilePicture(Guid id, CancellationToken ct)
        => ToFile(await media.GetProfilePictureAsync(id, ct));

    [HttpGet("public/people/{id:guid}/picture")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicProfilePicture(Guid id, CancellationToken ct)
        => ToFile(await media.GetPublicProfilePictureAsync(id, ct), PublicMediaCache);

    [HttpGet("public/films/{id:guid}/poster")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicPoster(Guid id, CancellationToken ct)
        => ToFile(await media.GetPublicPosterAsync(id, ct), PublicMediaCache);

    [HttpPost("me/photos")]
    [Authorize(Roles = AppRoles.Actor)]
    [EnableRateLimiting(RateLimitPolicies.Upload)]
    public async Task<ActionResult<MediaItemDto>> AddPhoto([FromForm] AddPhotoForm form, CancellationToken ct)
    {
        var kind = form.Kind.Trim().ToLowerInvariant() switch
        {
            "headshot" => MediaKind.Headshot,
            "fullbody" => MediaKind.FullBody,
            "productionstill" => MediaKind.ProductionStill,
            _ => throw new BadRequestException("Kind must be Headshot, FullBody or ProductionStill.")
        };

        await using var stream = form.File.OpenReadStream();
        var item = await media.AddAsync(kind, form.Caption, stream, form.File.Length, ct);
        return StatusCode(StatusCodes.Status201Created, item);
    }

    [HttpGet("actors/{id:guid}/photos")]
    public async Task<ActionResult<IReadOnlyList<MediaItemDto>>> ListPhotos(Guid id, CancellationToken ct)
        => Ok(await media.ListAsync(id, showreels: false, ct));

    [HttpPost("me/showreels")]
    [Authorize(Roles = AppRoles.Actor)]
    [EnableRateLimiting(RateLimitPolicies.UploadVideo)]
    [RequestSizeLimit(ShowreelRequestLimit)]
    [RequestFormLimits(MultipartBodyLengthLimit = ShowreelRequestLimit)]
    public async Task<ActionResult<MediaItemDto>> AddShowreel([FromForm] AddShowreelForm form, CancellationToken ct)
    {
        await using var stream = form.File.OpenReadStream();
        var item = await media.AddAsync(MediaKind.Showreel, form.Caption, stream, form.File.Length, ct);
        return StatusCode(StatusCodes.Status201Created, item);
    }

    [HttpGet("actors/{id:guid}/showreels")]
    public async Task<ActionResult<IReadOnlyList<MediaItemDto>>> ListShowreels(Guid id, CancellationToken ct)
        => Ok(await media.ListAsync(id, showreels: true, ct));

    [HttpGet("media/{id:guid}")]
    public async Task<IActionResult> GetMedia(Guid id, CancellationToken ct)
        => ToFile(await media.GetAsync(id, ct));

    [HttpPut("films/{id:guid}/poster")]
    [Authorize(Roles = AppRoles.Director)]
    [RequireCompleteProfile]
    [EnableRateLimiting(RateLimitPolicies.Upload)]
    public async Task<ActionResult<MediaItemDto>> UploadPoster(Guid id, IFormFile file, CancellationToken ct)
    {
        await using var stream = file.OpenReadStream();
        return Ok(await media.SetFilmPosterAsync(id, stream, file.Length, ct));
    }

    [HttpDelete("films/{id:guid}/poster")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    [RequireCompleteProfile]
    public async Task<IActionResult> DeletePoster(Guid id, CancellationToken ct)
    {
        await media.DeleteFilmPosterAsync(id, ct);
        return NoContent();
    }

    [HttpPost("roles/{id:guid}/concept-art")]
    [Authorize(Roles = AppRoles.Director)]
    [RequireCompleteProfile]
    [EnableRateLimiting(RateLimitPolicies.Upload)]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<MediaItemDto>> AddConceptArt(Guid id, [FromForm] AddConceptArtForm form, CancellationToken ct)
    {
        await using var stream = form.File.OpenReadStream();
        var item = await media.AddConceptArtAsync(id, form.Caption, stream, form.File.Length, ct);
        return StatusCode(StatusCodes.Status201Created, item);
    }

    [HttpDelete("roles/{roleId:guid}/concept-art/{mediaId:guid}")]
    [Authorize(Roles = AppRoles.DirectorOrAdmin)]
    [RequireCompleteProfile]
    public async Task<IActionResult> DeleteConceptArt(Guid roleId, Guid mediaId, CancellationToken ct)
    {
        await media.DeleteConceptArtAsync(roleId, mediaId, ct);
        return NoContent();
    }

    [HttpDelete("me/media/{id:guid}")]
    public async Task<IActionResult> DeleteMedia(Guid id, CancellationToken ct)
    {
        await media.DeleteAsync(id, ct);
        return NoContent();
    }

    private IActionResult ToFile(MediaFile file, string cacheControl = "private, no-cache")
    {
        Response.Headers.CacheControl = cacheControl;   // privatno, ali uz proveru ETag-a (304 ako se nije promenilo)
        Response.Headers.XContentTypeOptions = "nosniff";

        var lastModified = new DateTimeOffset(DateTime.SpecifyKind(file.CreatedAtUtc, DateTimeKind.Utc));
        return File(
            file.Content,
            file.ContentType,
            lastModified,
            new EntityTagHeaderValue($"\"{file.AssetId:N}\""),
            enableRangeProcessing: true);
    }
}

public class AddPhotoForm
{
    // Headshot, FullBody ili ProductionStill
    [Required] public string Kind { get; set; } = null!;
    [StringLength(140)] public string? Caption { get; set; }
    [Required] public IFormFile File { get; set; } = null!;
}

public class AddShowreelForm
{
    [StringLength(140)] public string? Caption { get; set; }
    [Required] public IFormFile File { get; set; } = null!;
}

public class AddConceptArtForm
{
    [StringLength(140)] public string? Caption { get; set; }
    [Required] public IFormFile File { get; set; } = null!;
}