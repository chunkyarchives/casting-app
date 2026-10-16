namespace CastingApp.Application.Common;

public class NotFoundException(string entity, object key) : Exception($"{entity} '{key}' was not found.");

public class ConflictException(string message) : Exception(message);    

public class ForbiddenException(string message) : Exception(message);

public class UnauthorizedException(string message) : Exception(message);

public class BadRequestException(string message) : Exception(message);