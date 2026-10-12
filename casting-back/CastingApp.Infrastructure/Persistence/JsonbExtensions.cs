using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CastingApp.Infrastructure.Persistence;

public static class JsonbExtensions
{
    private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);
    public static PropertyBuilder<T> HasJsonbConversion<T>(this PropertyBuilder<T> builder)
        where T : class, new()
    {
        var converter = new ValueConverter<T, string>(
            v => JsonSerializer.Serialize(v, Options),
            v => JsonSerializer.Deserialize<T>(v, Options) ?? new T());
            
        var comparer = new ValueComparer<T>(
            (a, b) => JsonSerializer.Serialize(a, Options) == JsonSerializer.Serialize(b, Options),
            v => JsonSerializer.Serialize(v, Options).GetHashCode(),
            v => JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(v, Options), Options)!);

        builder.HasConversion(converter, comparer).HasColumnType("jsonb");
        return builder;
    }
}