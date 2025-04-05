import { getCookieOptions } from './../../utils/get-cookie-options';

describe('getCookieOptions', () => {
  it('should return default cookie options', () => {
    process.env['NODE_ENV'] = 'production';
    const options = getCookieOptions();
		
    expect(options)
      .toEqual({
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        expires: expect.any(Date),
      });
  });
});
