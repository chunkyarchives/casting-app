using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using SkiaSharp;

namespace CastingApp.Infrastructure.Media;

public sealed class ImageProcessor : IImageProcessor
{
    private const long maxPixels = 40_000_000;
    private const int webpQuality = 85;
    private const string unreadable = "The picture could not be read.";

    public ProcessedImage CropToShape(Stream content, ImageShape shape)
    {
        using var data = SKData.Create(content) ?? throw new BadRequestException(unreadable);
        using var codec = SKCodec.Create(data) ?? throw new BadRequestException(unreadable);

        if ((long)codec.Info.Width * codec.Info.Height > maxPixels)
            throw new BadRequestException("The picture is too large (max 40 megapixels).");

        using var bitmap = SKBitmap.Decode(codec) ?? throw new BadRequestException(unreadable);
        using var source = SKImage.FromBitmap(bitmap);

        var origin = codec.EncodedOrigin;
        var turned = origin is SKEncodedOrigin.LeftTop or SKEncodedOrigin.RightTop or SKEncodedOrigin.RightBottom or SKEncodedOrigin.LeftBottom;
        var uprightWidth = turned ? bitmap.Height : bitmap.Width;
        var uprightHeight = turned ? bitmap.Width : bitmap.Height;

        var crop = CentreCrop(uprightWidth, uprightHeight, shape);

        var (width, height) = crop.Width > shape.Width ? (shape.Width, shape.Height) : (crop.Width, crop.Height);

        using var surface = SKSurface.Create(new SKImageInfo(width, height)) ?? throw new InvalidOperationException("Could not create a drawing surface.");

        var matrix = SKMatrix.Concat(
            SKMatrix.CreateScale((float)width / crop.Width, (float)height / crop.Height),
            SKMatrix.Concat(
                SKMatrix.CreateTranslation(-crop.Left, -crop.Top),
                UprightMatrix(origin, bitmap.Width, bitmap.Height)));

        surface.Canvas.SetMatrix(matrix);
        surface.Canvas.DrawImage(source, 0, 0, new SKSamplingOptions(SKFilterMode.Linear, SKMipmapMode.Linear));

        using var result = surface.Snapshot();
        using var encoded = result.Encode(SKEncodedImageFormat.Webp, webpQuality) ?? throw new InvalidOperationException("Could not encode the picture as WebP.");

        return new ProcessedImage(encoded.ToArray(), "image/webp", "webp");
    }

    private static SKRectI CentreCrop(int width, int height, ImageShape shape)
    {
        var tooWide = (long)width * shape.Height > (long)height * shape.Width;
        var cropWidth = tooWide ? (int)((long)height * shape.Width / shape.Height) : width;
        var cropHeight = tooWide ? height : (int)((long)width * shape.Height / shape.Width);

        return SKRectI.Create((width - cropWidth) / 2, (height - cropHeight) / 2, cropWidth, cropHeight);
    }

    private static SKMatrix UprightMatrix(SKEncodedOrigin origin, int w, int h) => origin switch
    {
        SKEncodedOrigin.TopRight => new SKMatrix(-1, 0, w, 0, 1, 0, 0, 0, 1),       // ogledalo levo-desno
        SKEncodedOrigin.BottomRight => new SKMatrix(-1, 0, w, 0, -1, h, 0, 0, 1),   // 180°
        SKEncodedOrigin.BottomLeft => new SKMatrix(1, 0, 0, 0, -1, h, 0, 0, 1),     // ogledalo gore-dole
        SKEncodedOrigin.LeftTop => new SKMatrix(0, 1, 0, 1, 0, 0, 0, 0, 1),         // zamena osa
        SKEncodedOrigin.RightTop => new SKMatrix(0, -1, h, 1, 0, 0, 0, 0, 1),       // 90° u smeru kazaljke
        SKEncodedOrigin.RightBottom => new SKMatrix(0, -1, h, -1, 0, w, 0, 0, 1),   // zamena osa + 180°
        SKEncodedOrigin.LeftBottom => new SKMatrix(0, 1, 0, -1, 0, w, 0, 0, 1),     // 90° suprotno od kazaljke
        _ => SKMatrix.Identity
    };
}