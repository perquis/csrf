import { cookieOptions } from "@/common/constants/cookie";
import { TokenKeyName } from "@/common/enums/token-key-name";
import { TokenService } from "@/services/token.service";

const secretSyncMock = jest.fn()
  .mockReturnValue('mocked-secret');
const createTokenMock = jest.fn()
  .mockReturnValue('mocked-token');
const verifyMock = jest.fn()
  .mockReturnValue(true);

jest.mock('csrf', () => ({
  __esModule: true,
  default: jest.fn()
    .mockImplementation(() => ({
      secretSync: (...args: unknown[]) => secretSyncMock(...args),
      create: (...args: unknown[]) => createTokenMock(...args),
      verify: (...args: unknown[]) => verifyMock(...args),
    })),
}));

const cookieSerializeMock = jest.fn()
  .mockReturnValue('mocked-cookie');

jest.mock('cookie', () => ({
  __esModule: true,
  serialize: (...args: unknown[]) => cookieSerializeMock(...args),
}));

const signatureServiceVerifyMock = jest.fn()
  .mockReturnValue(true);

jest.mock('@/services/signature.service', () => ({
  SignatureService: jest.fn()
    .mockImplementation(() => ({
      generate: jest.fn(),
      verify: (...args: unknown[]) => signatureServiceVerifyMock(...args),
    })),
}));

describe('token-service', () => {
  const tokenService = new TokenService();
	
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a secret after instantiation', () => {
    expect(tokenService['secret'])
      .toBeDefined();
    expect(tokenService['secret'])
      .toBe('mocked-secret');
  });
	
  it('should create a secret', () => {
    const secret = tokenService['createSecret']();
		
    expect(secret)
      .toBe('mocked-secret');
    expect(secretSyncMock)
      .toHaveBeenCalledTimes(1);
  });
	
  it('should refresh the secret key', () => {
    secretSyncMock.mockReturnValueOnce('new-mocked-secret');
		
    tokenService.refreshSecretKey();

    expect(tokenService['secret'])
      .toBe('new-mocked-secret');
    expect(secretSyncMock)
      .toHaveBeenCalledTimes(1);
  });
	
  it('should set a cookie', () => {
    const cookie = tokenService.setCookie();

    expect(cookie)
      .toBe('mocked-cookie');
    expect(cookieSerializeMock)
      .toHaveBeenCalledWith(
        TokenKeyName._CSRF,
        tokenService['secret'],
        cookieOptions
      );
  });
	
  it('should generate a token', () => {
    const token = tokenService.generateToken();

    expect(token)
      .toBe('mocked-token');
    expect(createTokenMock)
      .toHaveBeenCalledWith(tokenService['secret']);
    expect(tokenService['signatureService'].generate)
      .toHaveBeenCalledWith(tokenService['secret'], 'mocked-token');
  });
	
  it('should verify a token', () => {
    const token = 'mocked-token';
    const isValid = tokenService.verifyToken(token);
		
    expect(isValid)
      .toBe(true);
    expect(signatureServiceVerifyMock)
      .toHaveBeenCalledWith(token);
    expect(verifyMock)
      .toHaveBeenCalledWith(tokenService['secret'], token);
  });
	
  it('should return false if the token is invalid', () => {
    verifyMock.mockReturnValueOnce(false);
    signatureServiceVerifyMock.mockReturnValueOnce(false);

    const token = 'invalid-token';
    const isValid = tokenService.verifyToken(token);
		
    expect(isValid)
      .toBe(false);
    expect(signatureServiceVerifyMock)
      .toHaveBeenCalledWith(token);
    expect(verifyMock)
      .toHaveBeenCalledWith(tokenService['secret'], token);
  });
});
