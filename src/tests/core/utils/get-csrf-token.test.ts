import { getCsrfToken } from '@/core/utils/get-csrf-token';
import type { Request } from 'express';

describe('get-csrf-token', () => {
  it('should return the CSRF token from headers, body, or query', () => {
    const reqMock = {
      headers: {
        'csrf-token': 'header-csrf-token',
        'x-csrf-token': 'header-x-csrf-token',
        'x-xsrf-token': 'header-x-xsrf-token',
      },
      body: {
        _csrf: 'body-csrf-token',
      },
      query: {
        _csrf: 'query-csrf-token',
      },
    } as unknown as Request;

    expect(getCsrfToken(reqMock))
      .toBe('header-csrf-token');
  });

  it('should return undefined if no CSRF token is found', () => {
    const reqMock = {
      headers: {},
      body: {},
      query: {},
    } as unknown as Request;

    expect(getCsrfToken(reqMock))
      .toBeUndefined();
  });
});
