export const cookieOptions = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export const SET_COOKIE_HEADER = 'Set-Cookie';
