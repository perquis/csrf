import { StatusCodes } from "http-status-codes";

export const CSRF_ERROR_MESSAGES = {
  [StatusCodes.BAD_REQUEST]: 'CSRF token is missing in the request headers.',
  [StatusCodes.FORBIDDEN]: 'CSRF token is invalid.',
  [StatusCodes.GONE]: 'CSRF token has expired.',
} as Record<number, string>;

export class CsrfError extends Error {
  constructor(
    private statusCode: number = StatusCodes.FORBIDDEN,
  ) {
    super(CSRF_ERROR_MESSAGES[statusCode] || 'CSRF error occurred.');
    this.name = 'CsrfError';
    this.statusCode = statusCode;
  }

  static isCsrfError(error: unknown): error is CsrfError {
    return error instanceof CsrfError;
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
