export interface CookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: 'strict' | 'lax' | 'none';
	path?: string;
	domain?: string;
	expires?: Date;
}

export const COOKIE_ERROR_MESSAGES = {
  INVALID_COOKIE_OPTIONS: 'Invalid cookie options',
};

/**
 * This function generates cookie options based on the provided options.
 * 
 * @param options - The cookie options to set.
 * @param options.httpOnly - Whether the cookie is HTTP only.
 * @param options.secure - Whether the cookie is secure.
 * @param options.sameSite - The SameSite attribute for the cookie.
 * @param options.path - The path for the cookie.
 * @param options.domain - The domain for the cookie.
 * @param options.expires - The expiration date for the cookie.
 * @returns The complete cookie options.
 */
export const getCookieOptions = (options?: CookieOptions) => {
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(Date.now() + 60 * 60 * 1000),
    ...options,
  };
	
  return defaultOptions;
};
