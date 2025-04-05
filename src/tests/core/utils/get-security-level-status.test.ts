import { SecurityLevel } from '@/common/enums/security-level';
import { TokenKeyName } from '@/common/enums/token-key-name';
import { getSecurityLevelStatus } from '@/core/utils/get-security-level-status';
import { reqMock } from '@/tests/mocks/request-handler';

describe('get-security-level-status', () => {
  reqMock.cookies[TokenKeyName._CSRF] = 'mocked-csrf-token';

  it('should return SAFE_METHOD_AND_NO_SECRET for GET with no secret', () => {
    reqMock.method = 'GET';
    reqMock.cookies[TokenKeyName._CSRF] = undefined;

    const result = getSecurityLevelStatus(reqMock);

    expect(result)
      .toBe(SecurityLevel.SAFE_METHOD_AND_NO_SECRET);
  });

  it('should return PROTECTED_METHOD_NO_SECRET_FOUND for POST with no secret', () => {
    reqMock.method = 'POST';
    reqMock.cookies[TokenKeyName._CSRF] = undefined;

    const result = getSecurityLevelStatus(reqMock);

    expect(result)
      .toBe(SecurityLevel.PROTECTED_METHOD_NO_SECRET_FOUND);
  });

  it('should return PROTECTED_METHOD_AND_FOUND_SECRET for POST with secret', () => {
    reqMock.method = 'POST';
    reqMock.cookies[TokenKeyName._CSRF] = 'mocked-csrf-token';

    const result = getSecurityLevelStatus(reqMock);

    expect(result)
      .toBe(SecurityLevel.PROTECTED_METHOD_AND_FOUND_SECRET);
  });
});
