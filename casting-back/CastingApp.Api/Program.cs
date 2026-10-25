using System.Text;
using Microsoft.AspNetCore.Authorization;
using CastingApp.Api.Auth;
using CastingApp.Api.Chat;
using CastingApp.Api.RateLimiting;
using CastingApp.Application.Abstractions;
using CastingApp.Infrastructure.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json.Serialization;
using CastingApp.Api;
using CastingApp.Application;
using CastingApp.Infrastructure;
using CastingApp.Infrastructure.Persistence;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApi();

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
builder.Services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
    .Configure<JwtOptions>((bearer, jwt) =>
    {
        bearer.MapInboundClaims = false;
        bearer.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt.Issuer,
            ValidateAudience = true,
            ValidAudience = jwt.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30),
            NameClaimType = "name",
            RoleClaimType = "role"
        };

        bearer.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies[AuthCookie.Name];
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization(o =>
{
    // Svaki endpoint traži prijavljenog korisnika, osim onih označenih sa [AllowAnonymous]
    o.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
});

builder.Services.AddCastingRateLimiting();

// Chat u realnom vremenu: korisnik se prepoznaje po "sub", a Redis povezuje više instanci API-ja
builder.Services.AddSingleton<IUserIdProvider, SubUserIdProvider>();
builder.Services.AddSingleton<IChatNotifier, SignalRChatNotifier>();
builder.Services.AddSignalR()
    .AddStackExchangeRedis(builder.Configuration.GetConnectionString("Redis")!);

builder.Services.AddCors(o => o.AddPolicy("frontend", p => p
    .WithOrigins("http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()));

var app = builder.Build();

app.UseExceptionHandler();

app.MapGet("/health", async (AppDbContext db, IConnectionMultiplexer redis) =>
{
    var postgresOk = await db.Database.CanConnectAsync();
    var redisPing = await redis.GetDatabase().PingAsync();
    return Results.Ok(new { postgres = postgresOk, redisPingMs = redisPing.TotalMilliseconds });
}).AllowAnonymous();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi().AllowAnonymous();
    app.UseSwaggerUI(o => o.SwaggerEndpoint("/openapi/v1.json", "CastingApp API v1"));

    await DevSeeder.SeedAsync(app.Services);
}

// Posle DevSeeder-a, jer on preskače seed ako u bazi već postoji bilo koji nalog
await AdminBootstrapper.EnsureAsync(app.Services, app.Configuration);

app.UseHttpsRedirection();
app.UseCors("frontend");
app.UseAuthentication();
app.UseCastingRateLimiting();   // posle autentikacije, da zna ko je korisnik
app.UseAuthorization();
app.MapControllers();

// Veza se zatvara kad istekne access token, pa zaključan ili odjavljen korisnik ne ostaje povezan zauvek
app.MapHub<ChatHub>("/hubs/chat", o => o.CloseOnAuthenticationExpiration = true);

app.Run();