import { StatusCodes } from 'http-status-codes';

export class CsrfError extends Error {
  constructor() {
    super('CSRF token is invalid.');
    this.name = 'CsrfError';
  }

  static isCsrfError(error: unknown): error is CsrfError {
    return error instanceof CsrfError;
  }

  toJSON() {
    return {
      success: false,
      statusCode: StatusCodes.FORBIDDEN,
      message: this.message,
    };
  }
}
