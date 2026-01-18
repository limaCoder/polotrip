export class ApiError extends Error {
  statusCode: number;
  message: string;
  errorCode?: string;
  details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    errorCode?: string,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.message = message;
    this.errorCode = errorCode;
    this.details = details;
  }

  toResponse() {
    return {
      error: {
        message: this.message,
        code: this.errorCode || `ERROR_${this.statusCode}`,
        ...(this.details ? { details: this.details } : {}),
        ...(process.env.NODE_ENV !== "production" ? { stack: this.stack } : {}),
      },
    };
  }
}

export class UnauthorizedError extends ApiError {
  constructor(
    message = "Não autorizado",
    errorCode?: string,
    details?: unknown
  ) {
    super(401, message, errorCode || "UNAUTHORIZED", details);
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request", errorCode?: string, details?: unknown) {
    super(400, message, errorCode || "BAD_REQUEST", details);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends ApiError {
  constructor(
    message = "Resource not found",
    errorCode?: string,
    details?: unknown
  ) {
    super(404, message, errorCode || "NOT_FOUND", details);
    this.name = "NotFoundError";
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(
    message = "Too many requests",
    errorCode?: string,
    details?: unknown
  ) {
    super(429, message, errorCode || "TOO_MANY_REQUESTS", details);
    this.name = "TooManyRequestsError";
  }
}

export class ChatRateLimitExceededError extends TooManyRequestsError {
  constructor(remaining: number, limit: number, resetAt: Date) {
    super(
      "You have reached the daily limit of prompts. Please try again tomorrow.",
      "CHAT_RATE_LIMIT_EXCEEDED",
      {
        remaining,
        limit,
        resetAt: resetAt.toISOString(),
      }
    );
    this.name = "ChatRateLimitExceededError";
  }
}

export class InternalServerError extends ApiError {
  constructor(
    message = "Internal server error",
    errorCode?: string,
    details?: unknown
  ) {
    super(500, message, errorCode || "INTERNAL_SERVER_ERROR", details);
    this.name = "InternalServerError";
  }
}
