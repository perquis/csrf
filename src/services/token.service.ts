import { cookieOptions } from "@/common/constants/cookie";
import { TokenKeyName } from "@/common/enums/token-key-name";
import { SignatureService } from "@/services/signature.service";
import * as cookie from 'cookie';
import Tokens from "csrf";

const tokens = new Tokens();

export class TokenService {
  private secret: string;

  constructor(
		private signatureService = new SignatureService(),
  ) {
    this.secret = this.createSecret();
  }
	
  private createSecret(): string {
    return tokens.secretSync();
  }
	
  public refreshSecretKey() {
    this.secret = this.createSecret();
  }

  public setCookie(): string {
    return cookie.serialize(
      TokenKeyName._CSRF,
      this.secret,
      cookieOptions
    );
  }

  public generateToken() {
    const newToken = tokens.create(this.secret);
    this.signatureService.generate(this.secret, newToken);

    return newToken;
  }

  public verifyToken(token: string): boolean {
    const isSignatureValid = this.signatureService.verify(token);
    const isTokenVerified = tokens.verify(this.secret, token);

    return isSignatureValid && isTokenVerified;
  }
}
