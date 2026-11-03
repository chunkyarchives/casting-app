using CastingApp.Application.Abstractions;

namespace CastingApp.Application.Common;

internal static class MediaStorageExtensions
{
    // Fajlovi se brišu posle redova u bazi. Fajl koji ne može da se obriše samo zauzima mesto na disku; zbog njega ne sme da padne zahtev čiji su podaci već obrisani.
    public static async Task TryDeleteAsync(this IMediaStorage storage, IEnumerable<string> keys)
    {
        foreach (var key in keys)
        {
            try
            {
                await storage.DeleteAsync(key, CancellationToken.None);
            }
            catch (Exception e) when (e is IOException or UnauthorizedAccessException)
            {}
        }
    }
}