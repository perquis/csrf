import { cookieOptions } from '@/common/constants/cookie-options';
import { TokenKeyName } from '@/common/enums/token-key-name';
import { CsrfController } from '@/core/controllers/csrf-controller';
import { resMock } from '@/tests/mocks/request-handler';
import * as cookie from 'cookie';

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
  serialize: jest
    .fn()
    .mockReturnValue('csrf=mocked-secret; HttpOnly; Path=/; SameSite=Lax; Secure'),
}));

describe('csrf-controller', () => {
  const csrfController = new CsrfController();

  it('should set cookie', () => {
    csrfController.setCookie(resMock);

    expect(csrfController.secret)
      .toBe('mocked-secret');
    expect(resMock.setHeader)
      .toHaveBeenCalledWith(
        'Set-Cookie',
        'csrf=mocked-secret; HttpOnly; Path=/; SameSite=Lax; Secure',
      );
    expect(cookie.serialize)
      .toHaveBeenCalledWith(
        TokenKeyName._CSRF,
        csrfController.secret,
        cookieOptions,
      );
  });

  it('should get token', () => {
    const token = csrfController.getToken();

    expect(token)
      .toBe('mocked-token');
  });

  it('should return true if secret is not empty for verifyToken', () => {
    const isValid = csrfController.verifyToken('mocked-token');

    expect(isValid)
      .toBe(true);
  });

  it('should return false if secret is null for verifyToken', () => {
    const controller = new CsrfController();
    const isValid = controller.verifyToken('mocked-token');

    expect(isValid)
      .toBe(false);
  });
});
