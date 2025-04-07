import { SignatureService } from "@/core/services/signature-service";

describe('signature-service', () => {
  const value = `secret.JO5pGXefw6ol82MSwdeL4jug23MgOUg9BaoFyssoP0A`;
  const signatureService = new SignatureService();
	
  it('should generate a signature', () => {
    signatureService.generate('secret', 'token');
		
    expect(signatureService.signed)
      .toBe(value);
  });
	
  it('should verify a signature', () => {
    const verify = signatureService.verify('token');

    expect(verify)
      .toBe(true);
  });
	
  it('should not verify a signature', () => {
    const verify = signatureService.verify('wrong-token');

    expect(verify)
      .toBe(false);
  });
	
  it('should return false if no signature is generated', () => {
    const service = new SignatureService();
    const verify = service.verify('token');
		
    expect(verify)
      .toBe(false);
  });
});
