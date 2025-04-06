import { TokenKeyName } from '@/common/enums/token-key-name';
import type { Request } from 'express';

export const getCsrfToken = (req: Request): string | undefined =>
  req.headers[TokenKeyName.CSRF_TOKEN] ||
  req.headers[TokenKeyName.XSRF_TOKEN] ||
  req.headers[TokenKeyName.X_CSRF_TOKEN] ||
  req.headers[TokenKeyName.X_XSRF_TOKEN] ||
  req.body[TokenKeyName._CSRF] ||
  req.query[TokenKeyName._CSRF];
