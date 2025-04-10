import { CsrfTokenMiddleware } from '@/middlewares/csrf-token.middleware';
import type { RequestHandler } from 'express';

const csrfMiddleware = new CsrfTokenMiddleware();

const csrf = (): RequestHandler => (req, res, next) =>
  csrfMiddleware.init(req, res, next);

export { csrf as default };
