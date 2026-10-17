using System.ComponentModel.DataAnnotations;
using CastingApp.Application.Common;
using CastingApp.Application.DTOs.Media;
using CastingApp.Application.Services.Media;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api")]
public class MediaController(IMediaService media) : ControllerBase
{
    private const long ShowreelRequestLimit = 210L * 1024 * 1024;

    [HttpPut("me/profile-picture")]
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

    [HttpPost("me/photos")]
    [Authorize(Roles = AppRoles.Actor)]
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

    [HttpDelete("me/media/{id:guid}")]
    public async Task<IActionResult> DeleteMedia(Guid id, CancellationToken ct)
    {
        await media.DeleteAsync(id, ct);
        return NoContent();
    }

    private IActionResult ToFile(MediaFile file)
    {
        Response.Headers.CacheControl = "private, no-cache";   // privatno, ali uz proveru ETag-a (304 ako se nije promenilo)
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