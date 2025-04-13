import { TokenService } from '@/services/token.service';
import type { NextFunction, Request, Response } from 'express';
import { TokenKeyName } from '@/common/enums/token-key-name';
import { SET_COOKIE_HEADER } from '@/common/constants/cookie';
import { STATUS_CODE } from '@/common/constants/status-code';

export class CsrfTokenMiddleware {
  public static readonly errorMessages = {
    invalidToken: 'Invalid CSRF token',
  };

  constructor(
		private tokenService = new TokenService(),
  ) {}
	
  public init(req: Request, res: Response, next: NextFunction): void {
    const invalidTokenError = Error(CsrfTokenMiddleware.errorMessages.invalidToken);
    const isSafeMethod = this.isSafeMethod(req);
    
    if (isSafeMethod) {
      req.csrfToken = () => this.tokenService.generateToken();
    }

    if (this.isSafeWithoutSecret(req)) {
      res.setHeader(SET_COOKIE_HEADER, this.tokenService.setCookie());
    }

    if (this.shouldRejectWithoutSecret(req)) {
      res.status(STATUS_CODE.FORBIDDEN);
			
      return next(invalidTokenError);
    }
		
    if (this.hasSecretButInvalidToken(req, res)) {
      res.status(STATUS_CODE.FORBIDDEN);
			
      return next(invalidTokenError);
    }

    return next();
  }

  private isSafeWithoutSecret(req: Request): boolean {
    return this.isSafeMethod(req) && !this.hasSecret(req);
  }

  private shouldRejectWithoutSecret(req: Request): boolean {
    return !this.isSafeMethod(req) && !this.getSecret(req);
  }
	
  private hasSecretButInvalidToken(req: Request, res: Response): boolean {
    return !this.isSafeMethod(req) && this.verifyTokenOrFail(req, res);
  }
	
  private verifyTokenOrFail(req: Request, res: Response): boolean {
    const token = this.getToken(req);

    if (!token) return true;
		
    const isVerified = this.tokenService.verifyToken(token);
    if (isVerified) return false;

    this.tokenService.refreshSecretKey();
    res.setHeader(SET_COOKIE_HEADER, this.tokenService.setCookie());

    return true;
  }
	
  private isSafeMethod(req: Request): boolean {
    return ['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(req.method);
  }
	
  private hasSecret(req: Request): boolean {
    return !!this.getSecret(req);
  }
	
  private getSecret(req: Request): string | undefined {
    return req.cookies[TokenKeyName._CSRF];
  }
	
  private getToken(req: Request): string | undefined {
    return (req.headers[TokenKeyName.CSRF_TOKEN]
			|| req.headers[TokenKeyName.XSRF_TOKEN]
			|| req.headers[TokenKeyName.X_CSRF_TOKEN]
			|| req.headers[TokenKeyName.X_XSRF_TOKEN]
			|| (req.body ?? {})[TokenKeyName._CSRF]
			|| (req.query ?? {})[TokenKeyName._CSRF]);
  }
}
