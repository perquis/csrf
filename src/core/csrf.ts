import { SecurityLevel } from '@/common/enums/security-level';
import { CsrfController } from '@/core/controllers/csrf-controller';
import { CsrfError } from '@/core/errors/csrf-error';
import { getCsrfToken } from '@/core/utils/get-csrf-token';
import { getSecurityLevelStatus } from '@/core/utils/get-security-level-status';
import type { RequestHandler } from 'express';

export const csrf = (): RequestHandler => {
  const csrfController = new CsrfController();

  return (req, res, next) => {
    const securityLevel = getSecurityLevelStatus(req);

    if (securityLevel === SecurityLevel.SAFE_METHOD_AND_NO_SECRET) {
      csrfController.setCookie(res);
    }

    req.csrfToken = csrfController.getToken;

    if (securityLevel === SecurityLevel.PROTECTED_METHOD_NO_SECRET_FOUND) {
      return next(new CsrfError());
    }

    if (securityLevel === SecurityLevel.PROTECTED_METHOD_AND_FOUND_SECRET) {
      const csrfToken = getCsrfToken(req);
      if (!csrfToken) return next(new CsrfError());

      const isValidToken = csrfController.verifyToken(csrfToken);
      if (!isValidToken) return next(new CsrfError());
    }

    return next();
  };
};
