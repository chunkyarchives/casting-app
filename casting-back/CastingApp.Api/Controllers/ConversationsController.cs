using System.ComponentModel.DataAnnotations;
using CastingApp.Application.DTOs.Conversations;
using CastingApp.Application.Services.Conversations;
using Microsoft.AspNetCore.Mvc;
using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using Microsoft.AspNetCore.Authorization;

namespace CastingApp.Api.Controllers;

[ApiController]
[Route("api/conversations")]
public class ConversationsController(IConversationService conversations, IMessageService messages, ICurrentUser currentUser) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = AppRoles.ActorDirectorOrAdmin)]
    public async Task<ActionResult<PagedResult<ConversationDto>>> List(
        [FromQuery] Guid? actorId,
        [FromQuery] Guid? directorId,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        CancellationToken ct = default)
        => Ok(await conversations.ListAsync(actorId, directorId, page, pageSize, ct));

    [HttpGet("{id:guid}")]
    [Authorize(Roles = AppRoles.ActorDirectorOrAdmin)]
    public async Task<ActionResult<ConversationDto>> Get(Guid id, CancellationToken ct)
        => Ok(await conversations.GetAsync(id, ct));

    [HttpPost]
    [Authorize(Roles = AppRoles.Director)]
    public async Task<ActionResult<ConversationDto>> Start(StartConversationRequest request, CancellationToken ct)
    {
        var result = await conversations.StartAsync(request, ct);
        return result.Created
            ? CreatedAtAction(nameof(Get), new { id = result.Conversation.Id }, result.Conversation)
            : Ok(result.Conversation);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AppRoles.Admin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await conversations.DeleteAsync(id, ct);
        return NoContent();
    }

    // Poruke jednog razgovora - ugnežđeni resurs
    [HttpGet("{id:guid}/messages")]
    [Authorize(Roles = AppRoles.ActorOrDirector)]
    public async Task<ActionResult<MessageHistoryDto>> ListMessages(
        Guid id,
        [FromQuery] DateTimeOffset? before,
        [FromQuery, Range(1, 100)] int limit = 50,
        CancellationToken ct = default)
        => Ok(await messages.ListAsync(id, currentUser.Id, before, limit, ct));

    [HttpPost("{id:guid}/messages")]
    [Authorize(Roles = AppRoles.ActorOrDirector)]
    public async Task<ActionResult<MessageDto>> SendMessage(
        Guid id, SendMessageRequest request, CancellationToken ct)
    {
        var message = await messages.SendAsync(id, currentUser.Id, request.Content, ct);
        return StatusCode(StatusCodes.Status201Created, message);   // poruka nema svoj GET endpoint
    }
}