namespace CastingApp.Application.Abstractions;

public sealed record ImageShape(int Width, int Height);

public sealed record ProcessedImage(byte[] Content, string ContentType, string Extension);

public interface IImageProcessor
{
    ProcessedImage CropToShape(Stream content, ImageShape shape);
}