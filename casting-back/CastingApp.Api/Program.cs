using System.Text.Json.Serialization;
using CastingApp.Api;
using CastingApp.Application;
using CastingApp.Infrastructure;
using CastingApp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
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
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(o => o.SwaggerEndpoint("/openapi/v1.json", "CastingApp API v1"));

    await DevSeeder.SeedAsync(app.Services);

    // temporal: korisno za uvid u korisnike
    app.MapGet("/dev/participants", async (AppDbContext db) =>
        await db.Users.AsNoTracking()
            .Select(p => new { p.Id, p.Email, p.FirstName, p.LastName, p.Role })
            .ToListAsync());
}

app.UseHttpsRedirection();
app.UseCors("frontend");
// app.UseAuthentication(); dodajemo kad uvedemo JWT/cookie
app.UseAuthorization();
app.MapControllers();

app.Run();