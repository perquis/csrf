import { SET_COOKIE_HEADER } from "@/common/constants/cookie";
import { STATUS_CODE } from "@/common/constants/status-code";
import { TokenKeyName } from "@/common/enums/token-key-name";
import { CsrfTokenMiddleware } from "@/middlewares/csrf-token.middleware";
import type { Request, Response } from "express";

const generateTokenMock = jest.fn();
const tokenVerifyMock = jest.fn()
  .mockReturnValue(false);

jest.mock('@/services/token.service', () => ({
  TokenService: jest.fn()
    .mockImplementation(() => ({
      generateToken: () => generateTokenMock(),
      verifyToken: () => tokenVerifyMock(),
      setCookie: jest.fn()
        .mockReturnValue('cookie'),
      refreshSecretKey: jest.fn(),
    })),
}));

const originalRequestMock = {
  generateCsrfToken: jest.fn(),
  setCookie: jest.fn(),
  cookie: jest.fn(),
  cookies: {},
  body: {},
  query: {},
  headers: {},
  params: {},
} as unknown as Request;

describe('csrf-token-middleware', () => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE'] as const;
  const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'] as const;
  const csrfTokenMiddleware = new CsrfTokenMiddleware();
  let reqMock = {
    ...originalRequestMock,
  } as unknown as Request;
	
  const nextMock = jest.fn();
	
  const resMock = {
    cookie: jest.fn(),
    setHeader: jest.fn(),
    status: jest.fn()
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
		
    reqMock = {
      ...originalRequestMock
    } as unknown as Request;
  });

  it.each(safeMethods)('should create a cookie on %s', (method) => {
    reqMock.method = method;

    csrfTokenMiddleware.init(reqMock, resMock, nextMock);

    expect(reqMock.csrfToken)
      .toEqual(expect.any(Function));
    expect(generateTokenMock)
      .not.toHaveBeenCalled();
    expect(resMock.setHeader)
      .toHaveBeenCalledWith(SET_COOKIE_HEADER, 'cookie');
    expect(resMock.status)
      .not.toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
    expect(nextMock)
      .toHaveBeenCalled();
    expect(nextMock)
      .toHaveBeenCalledWith();
  });
	
  it.each(safeMethods)('should not create a cookie when the request has secret on %s', (method) => {
    reqMock.method = method;
    reqMock.cookies = { _csrf: 'secret' };

    csrfTokenMiddleware.init(reqMock, resMock, nextMock);

    expect(reqMock.csrfToken)
      .toEqual(expect.any(Function));
    expect(generateTokenMock)
      .not.toHaveBeenCalled();
    expect(resMock.setHeader)
      .not.toHaveBeenCalled();
    expect(resMock.status)
      .not.toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
    expect(nextMock)
      .toHaveBeenCalled();
    expect(nextMock)
      .toHaveBeenCalledWith();
  });
	
  it.each(safeMethods)('should create a token on %s', (method) => {
    reqMock.method = method;
    reqMock.cookies = { _csrf: 'secret' };
    generateTokenMock.mockReturnValue('token');

    csrfTokenMiddleware.init(reqMock, resMock, nextMock);

    const createdToken = reqMock.csrfToken();

    expect(generateTokenMock)
      .toHaveBeenCalled();
    expect(createdToken)
      .toEqual('token');
    expect(resMock.setHeader)
      .not.toHaveBeenCalled();
    expect(resMock.status)
      .not.toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
    expect(nextMock)
      .toHaveBeenCalled();
    expect(nextMock)
      .toHaveBeenCalledWith();
  });
	
  it.each(unsafeMethods)(
    'should throw an error when the request has no secret on %s',
    (method) => {
      reqMock.method = method;
      reqMock.cookies = {};

      csrfTokenMiddleware.init(reqMock, resMock, nextMock);

      expect(reqMock.csrfToken)
        .toBeUndefined();
      expect(generateTokenMock)
        .not.toHaveBeenCalled();
      expect(resMock.setHeader)
        .not.toHaveBeenCalled();
      expect(resMock.status)
        .toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
      expect(nextMock)
        .toHaveBeenCalledWith(
          Error(CsrfTokenMiddleware.errorMessages.invalidToken)
        );
    });
	
  it.each(unsafeMethods)(
    'should throw an error when the request has a secret and an invalid token on %s',
    (method) => {
      reqMock.method = method;
      reqMock.cookies = { _csrf: 'secret' };
      reqMock.body = { _csrf: 'invalid-token' };			
			
      csrfTokenMiddleware.init(reqMock, resMock, nextMock);

      expect(reqMock.csrfToken)
        .toBeUndefined();
      expect(generateTokenMock)
        .not.toHaveBeenCalled();
      expect(resMock.setHeader)
        .toHaveBeenCalled();
      expect(resMock.status)
        .toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
      expect(nextMock)
        .toHaveBeenCalledWith(
          Error(CsrfTokenMiddleware.errorMessages.invalidToken)
        );
    }
  );
	
  it.each(unsafeMethods)(
    'should pass when the request has a secret and a valid token on %s',
    (method) => {
      reqMock.method = method;
      reqMock.cookies = { _csrf: 'secret' };
      reqMock.body = { _csrf: 'valid-token' };
			
      tokenVerifyMock.mockReturnValue(true);
			
      csrfTokenMiddleware.init(reqMock, resMock, nextMock);
			
      expect(reqMock.csrfToken)
        .toBeUndefined();
      expect(generateTokenMock)
        .not.toHaveBeenCalled();
      expect(resMock.setHeader)
        .not.toHaveBeenCalledWith(SET_COOKIE_HEADER, expect.any(String));
      expect(nextMock)
        .toHaveBeenCalled();
      expect(nextMock)
        .toHaveBeenCalledWith();
    }
  );
	
  it.each(unsafeMethods)(
    'should throw an error when the request has a secret and it doesn\'t pass a token on %s',
    (method) => {
      reqMock.method = method;
      reqMock.cookies = { _csrf: 'secret' };
			
      csrfTokenMiddleware.init(reqMock, resMock, nextMock);
			
      expect(reqMock.csrfToken)
        .toBeUndefined();
      expect(generateTokenMock)
        .not.toHaveBeenCalled();
      expect(resMock.setHeader)
        .not.toHaveBeenCalledWith(SET_COOKIE_HEADER, expect.any(String));
      expect(nextMock)
        .toHaveBeenCalled();
      expect(nextMock)
        .toHaveBeenCalledWith(
          Error(CsrfTokenMiddleware.errorMessages.invalidToken)
        );
    }
  );
	
  it.each([
    {
      key: 'headers',
      tokenName: TokenKeyName.CSRF_TOKEN,
      value: 'token',
    },
    {
      key: 'headers',
      tokenName: TokenKeyName.XSRF_TOKEN,
      value: 'token',
    },
    {
      key: 'headers',
      tokenName: TokenKeyName.X_CSRF_TOKEN,
      value: 'token',
    },
    {
      key: 'headers',
      tokenName: TokenKeyName.X_XSRF_TOKEN,
      value: 'token',
    },
    {
      key: 'body',
      tokenName: TokenKeyName._CSRF,
      value: 'token',
    },
    {
      key: 'query',
      tokenName: TokenKeyName._CSRF,
      value: 'token',
    }
  ] as const)(
    'should return value from $key when the user pass request with $tokenName',
    ({ key, tokenName, value }) => {
      reqMock[key] = { [tokenName]: value };

      const token = csrfTokenMiddleware['getToken'](reqMock);
			
      expect(token)
        .toEqual(value);
    }
  );
	
  it.each(['body', 'query'] as const)(
    'should return undefined when the user does not pass any arguments to $key', (key) => {
      reqMock[key] = undefined;

      const token = csrfTokenMiddleware['getToken'](reqMock);

      expect(token)
        .toBeUndefined();
    });
});
