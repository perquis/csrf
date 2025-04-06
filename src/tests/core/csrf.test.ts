import { TokenKeyName } from '@/common/enums/token-key-name';
import { csrf } from '@/core/csrf';
import { CsrfError } from '@/core/errors/csrf-error';
import { reqMock, resMock } from '@/tests/mocks/request-handler';

jest.mock('csrf', () => ({
  __esModule: true,
  default: jest.fn()
    .mockImplementation(() => ({
      secretSync: jest.fn()
        .mockReturnValue('mocked-secret'),
      create: jest.fn()
        .mockReturnValue('mocked-token'),
      verify: jest.fn()
        .mockReturnValue(true),
    })),
}));

jest.mock('cookie', () => ({
  serialize: jest.fn(),
}));

jest.mock('cookie-signature', () => ({
  sign: jest.fn(),
  unsign: jest.fn(),
}));

const setCookieMock = jest.fn();
const getTokenMock = jest.fn()
  .mockReturnValue('mocked-token');
const verifyTokenMock = jest.fn()
  .mockReturnValue(true);

jest.mock('@/core/controllers/csrf-controller', () => ({
  CsrfController: jest.fn()
    .mockImplementation(() => ({
      setCookie: setCookieMock,
      getToken: getTokenMock,
      verifyToken: verifyTokenMock,
    })),
}));

describe('csrf', () => {
  const nextMock = jest.fn();

  it(`should set cookie if no CSRF token and method is GET`, () => {
    reqMock.method = 'GET';

    csrf()(reqMock, resMock, nextMock);

    expect(resMock.cookie).not.toHaveBeenCalled();

    expect(setCookieMock)
      .toHaveBeenCalledTimes(1);
    expect(setCookieMock)
      .toHaveBeenCalledWith(resMock);

    expect(reqMock.csrfToken())
      .toBe('mocked-token');

    expect(nextMock)
      .toHaveBeenCalledTimes(1);
    expect(nextMock)
      .toHaveBeenCalledWith();
    expect(nextMock).not.toThrow(CsrfError);
  });

  it(`should throw if no CSRF token and method is POST`, () => {
    reqMock.method = 'POST';
    reqMock.cookies[TokenKeyName._CSRF] = undefined;

    csrf()(reqMock, resMock, nextMock);

    expect(nextMock)
      .toHaveBeenCalledTimes(1);
    expect(nextMock)
      .toHaveBeenCalledWith(new CsrfError());
  });

  it(`throw if CSRF token present, POST method, and body is invalid`, () => {
    reqMock.method = 'POST';
    reqMock.cookies[TokenKeyName._CSRF] = 'mocked-token';
    reqMock.body = { _csrf: undefined };

    csrf()(reqMock, resMock, nextMock);

    expect(nextMock)
      .toHaveBeenCalledTimes(1);
    expect(nextMock)
      .toHaveBeenCalledWith(new CsrfError());
  });

  it(`should passes if CSRF token present, POST method, and body is valid`, () => {
    reqMock.method = 'POST';
    reqMock.cookies[TokenKeyName._CSRF] = 'mocked-token';
    reqMock.body = { _csrf: 'mocked-token' };

    csrf()(reqMock, resMock, nextMock);

    expect(verifyTokenMock)
      .toHaveBeenCalledTimes(1);
    expect(verifyTokenMock)
      .toHaveBeenCalledWith(reqMock.body._csrf);

    expect(nextMock)
      .toHaveBeenCalledTimes(1);
    expect(nextMock)
      .toHaveBeenCalledWith();
  });

  it(`throws if CSRF token present, POST method, invalid body`, () => {
    reqMock.method = 'POST';
    reqMock.cookies[TokenKeyName._CSRF] = 'mocked-token';
    reqMock.body = { _csrf: 'invalid-token' };

    verifyTokenMock.mockReturnValue(false);

    csrf()(reqMock, resMock, nextMock);

    expect(verifyTokenMock)
      .toHaveBeenCalledTimes(1);
    expect(verifyTokenMock)
      .toHaveBeenCalledWith(reqMock.body._csrf);

    expect(nextMock)
      .toHaveBeenCalledTimes(1);
    expect(nextMock)
      .toHaveBeenCalledWith(new CsrfError());
  });
});
