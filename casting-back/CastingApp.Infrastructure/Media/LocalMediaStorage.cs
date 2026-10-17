using CastingApp.Application.Abstractions;

namespace CastingApp.Infrastructure.Media;

public sealed class LocalMediaStorage : IMediaStorage
{
    private readonly string root;

    public LocalMediaStorage(string rootPath)
    {
        root = Path.GetFullPath(rootPath);
        Directory.CreateDirectory(root);
    }

    public async Task SaveAsync(string key, Stream content, CancellationToken ct)
    {
        var path = Resolve(key);
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);

        await using var file = new FileStream(path, FileMode.CreateNew, FileAccess.Write, FileShare.None, 81920, useAsync: true);
        await content.CopyToAsync(file, ct);
    }

    public Task<Stream?> OpenReadAsync(string key, CancellationToken ct)
    {
        var path = Resolve(key);
        if (!File.Exists(path))
            return Task.FromResult<Stream?>(null);

        Stream stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 81920, useAsync: true);
        return Task.FromResult<Stream?>(stream);
    }

    public Task DeleteAsync(string key, CancellationToken ct)
    {
        var path = Resolve(key);
        if (File.Exists(path))
            File.Delete(path);
        return Task.CompletedTask;
    }

    private string Resolve(string key)
    {
        var full = Path.GetFullPath(Path.Combine(root, key));
        var comparison = OperatingSystem.IsWindows() ? StringComparison.OrdinalIgnoreCase : StringComparison.Ordinal;
        if (!full.StartsWith(root + Path.DirectorySeparatorChar, comparison))
            throw new InvalidOperationException("Invalid storage key.");
        return full;
    }
}