using System.Security.Cryptography;
using CastingApp.Application.Abstractions;
using CastingApp.Application.Common;
using Microsoft.EntityFrameworkCore;

namespace CastingApp.Application.Services.Crews;

internal static class ProductionCodes
{
    private const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private const int length = 6;

    public static async Task<string> GenerateUniqueAsync(IAppDbContext db, CancellationToken ct)
    {
        for (var attempt = 0; attempt < 5; attempt++)
        {
            var code = RandomNumberGenerator.GetString(alphabet, length);
            if (!await db.Crews.AnyAsync(c => c.ProductionCode == code, ct))
                return code;
        }

        throw new ConflictException("Could not generate a unique production code. Try again.");
    }
}