import { sign, unsign } from "cookie-signature";

export class SignatureService {
  constructor(private signed: string = "") {}

  public generate(secret: string, token: string) {
    this.signed = sign(secret, token);
  }
	
  public verify(token: string): boolean {
    return Boolean(unsign(this.signed, token));
  }
}
