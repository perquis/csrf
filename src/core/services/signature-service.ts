import { sign, unsign } from "cookie-signature";

export class SignatureService {
  public signed: string | null = null;

  public generate(secret: string, token: string) {
    this.signed = sign(secret, token);
  }
	
  public verify(token: string): boolean {
    if (!this.signed) return false;

    const signature = unsign(this.signed, token);
		
    return Boolean(signature);
  }
}
