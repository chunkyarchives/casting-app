using CastingApp.Domain.Enums;

namespace CastingApp.Application.Services.Media;

internal sealed record DetectedType(string ContentType, string Extension, bool IsVideo);

// Pravila po vrsti medija: veličina, broj stavki, folder i prepoznavanje sadržaja
internal static class MediaRules
{
    private const long mb = 1024 * 1024;

    private static readonly byte[] pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

    // Oznake ("brands") koje MP4 fajlovi imaju na početku; HEIC slike i QuickTime (.mov) tu ne ulaze
    private static readonly byte[][] mp4Brands =
    [
        "isom"u8.ToArray(), "iso2"u8.ToArray(), "iso4"u8.ToArray(), "iso5"u8.ToArray(), "iso6"u8.ToArray(),
        "mp41"u8.ToArray(), "mp42"u8.ToArray(), "avc1"u8.ToArray(), "dash"u8.ToArray(), "M4V "u8.ToArray()
    ];

    public static bool IsVideo(MediaKind kind) => kind == MediaKind.Showreel;

    public static long MaxBytes(MediaKind kind) => kind switch
    {
        MediaKind.ProfilePicture => 5 * mb,
        MediaKind.Showreel => 200 * mb,
        _ => 10 * mb
    };

    // Koliko stavki jedne vrste nalog sme da ima (profilna slika se zamenjuje, pa je 1)
    public static int MaxCount(MediaKind kind) => kind switch
    {
        MediaKind.Headshot => 5,
        MediaKind.FullBody => 5,
        MediaKind.ProductionStill => 10,
        MediaKind.Showreel => 3,
        _ => 1
    };

    public static string Folder(MediaKind kind) => kind switch
    {
        MediaKind.ProfilePicture => "profile-pictures",
        MediaKind.Showreel => "showreels",
        _ => "photos"
    };

    // Tip određujemo po prvim bajtovima fajla, ne po imenu ni po zaglavlju koje šalje klijent
    public static DetectedType? Detect(ReadOnlySpan<byte> b)
    {
        if (b.Length >= 3 && b[0] == 0xFF && b[1] == 0xD8 && b[2] == 0xFF)
            return new("image/jpeg", "jpg", false);

        if (b.Length >= 8 && b[..8].SequenceEqual(pngSignature))
            return new("image/png", "png", false);

        if (b.Length >= 12 && b[..4].SequenceEqual("RIFF"u8) && b.Slice(8, 4).SequenceEqual("WEBP"u8))
            return new("image/webp", "webp", false);

        // MP4: na pomaku 4 stoji "ftyp", a iza njega oznaka vrste
        if (b.Length >= 12 && b.Slice(4, 4).SequenceEqual("ftyp"u8) && IsMp4Brand(b.Slice(8, 4)))
            return new("video/mp4", "mp4", true);

        // WebM: EBML zaglavlje (isto ga ima i MKV), pa tražimo oznaku "webm" u prvim bajtovima
        if (b.Length >= 4 && b[0] == 0x1A && b[1] == 0x45 && b[2] == 0xDF && b[3] == 0xA3
            && b.IndexOf("webm"u8) >= 0)
            return new("video/webm", "webm", true);

        return null;
    }

    private static bool IsMp4Brand(ReadOnlySpan<byte> brand)
    {
        foreach (var known in mp4Brands)
            if (brand.SequenceEqual(known))
                return true;
        return false;
    }
}