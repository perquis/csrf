import type { HTTPMethod } from './../../utils/is-valid-methods';
import { isValidMethod, VALID_METHODS } from './../../utils/is-valid-methods';

describe('isValidMethods', () => {
  it('should return true for valid methods', () => {
    VALID_METHODS.forEach((method) => {
      expect(isValidMethod(method))
        .toBe(true);
    });
  });

  it('should return false for invalid methods', () => {
    const invalidMethods = ['CONNECT', 'TRACE', 'FOO', 'BAR'];
    
    invalidMethods.forEach((method) => {
      expect(isValidMethod(method as HTTPMethod))
        .toBe(false);
    });
  });
});
