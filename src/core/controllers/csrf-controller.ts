import { cookieOptions } from '@/common/constants/cookie-options';
import { TokenKeyName } from '@/common/enums/token-key-name';
import { SignatureService } from '@/core/services/signature-service';
import * as cookie from 'cookie';
import Tokens from 'csrf';
import type { Response } from 'express';
import type { HTTPMethod } from 'http-method-enum';

export type ProtectedMethods = HTTPMethod[];

export class CsrfController {
  private tokens = new Tokens();
  public secret: string | null = null;
  
  constructor(private signatureService = new SignatureService()) {}

  public setCookie(res: Response): void {
    if (!this.secret) this.secret = this.tokens.secretSync();

    res.setHeader('Set-Cookie', cookie.serialize(TokenKeyName._CSRF, this.secret, cookieOptions));
  }

  public getToken() {
    const newToken = this.tokens.create(this.secret!);

    this.signatureService.generate(this.secret!, newToken);

    return newToken;
  }

  public verifyToken(token: string): boolean {
    if (!this.secret) return false;
		
    const isSignatureValid = this.signatureService.verify(token);
    const isTokenVerified = this.tokens.verify(this.secret, token);

    return isSignatureValid && isTokenVerified;
  }
}
