import { StatusCodes } from 'http-status-codes';
import { CSRF_ERROR_MESSAGES, CsrfError } from './../../../api/errors/csrf-error';

describe('CsrfError', () => {
  it('should create an instance of CsrfError with default status code', () => {
    const error = new CsrfError();
		
    expect(error)
      .toBeInstanceOf(CsrfError);
    expect(error.message)
      .toBe(CSRF_ERROR_MESSAGES[StatusCodes.FORBIDDEN]);
  });
	
  it('should return true for isCsrfError method', () => {
    const error = new CsrfError();
		
    expect(CsrfError.isCsrfError(error))
      .toBe(true);
  });

  it('should return false for isCsrfError method', () => {
    const error = new Error('Some other error');
		
    expect(CsrfError.isCsrfError(error))
      .toBe(false);
  });
	
  it('should return the correct JSON representation', () => {
    const error = new CsrfError(
      StatusCodes.FORBIDDEN,
    );
		
    expect(error.toJSON())
      .toEqual({
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: CSRF_ERROR_MESSAGES[StatusCodes.FORBIDDEN],
      });
  });
	
  it(`should return other error message when the status code is not in CSRF_ERROR_MESSAGES`,
    () => {
      const error = new CsrfError(
        StatusCodes.GATEWAY_TIMEOUT,
      );

      expect(error.toJSON())
        .toEqual({
          success: false,
          statusCode: StatusCodes.GATEWAY_TIMEOUT,
          message: 'CSRF error occurred.',
        });
    });
});
