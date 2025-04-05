import { CsrfError } from '@/core/errors/csrf-error';
import { StatusCodes } from 'http-status-codes';

describe('CsrfError', () => {
  it('should call toJSON method', () => {
    const error = new CsrfError();
    expect(error.toJSON())
      .toEqual({
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: `CSRF token is invalid.`,
      });
  });

  it('should return true for isCsrfError method', () => {
    const error = new CsrfError();
    expect(CsrfError.isCsrfError(error))
      .toBe(true);
  });

  it('should return false for isCsrfError method with non-CsrfError', () => {
    const error = new Error('Some other error');
    expect(CsrfError.isCsrfError(error))
      .toBe(false);
  });
});
