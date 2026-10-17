using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using CastingApp.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Api.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class RequireCompleteProfileAttribute : TypeFilterAttribute
{
    public RequireCompleteProfileAttribute() : base(typeof(RequireCompleteProfileFilter)) { }
}

public sealed class RequireCompleteProfileFilter(ICurrentUser currentUser, IAppDbContext db) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (currentUser.IsAuthenticated && currentUser.Role != ParticipantRole.Admin)
        {
            var userId = currentUser.Id;
            var complete = await db.Users.AsNoTracking()
                .AnyAsync(u => u.Id == userId && u.ProfileCompletedAt != null, context.HttpContext.RequestAborted);

            if (!complete)
                throw new ForbiddenException("Complete your profile first. Your account is locked until all required fields are filled in.");
        }

        await next();
    }
}