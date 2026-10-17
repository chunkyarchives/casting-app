namespace CastingApp.Application.Abstractions;

public interface IMediaStorage
{
    Task SaveAsync(string key, Stream content, CancellationToken ct);
    Task<Stream?> OpenReadAsync(string key, CancellationToken ct);  
    Task DeleteAsync(string key, CancellationToken ct);
}