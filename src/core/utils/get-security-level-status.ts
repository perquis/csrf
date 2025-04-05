import { SecurityLevel } from '@/common/enums/security-level';
import { TokenKeyName } from '@/common/enums/token-key-name';
import type { Request } from 'express';
import HTTPMethod from 'http-method-enum';

export const getSecurityLevelStatus = (req: Request): SecurityLevel => {
  const secretKey = req.cookies[TokenKeyName._CSRF];
  let status: SecurityLevel = SecurityLevel.OK;

  const isSafeMethod =
    req.method === HTTPMethod.GET ||
    req.method === HTTPMethod.OPTIONS ||
    req.method === HTTPMethod.HEAD;
  const isProtectedMethod =
    req.method === HTTPMethod.POST ||
    req.method === HTTPMethod.PUT ||
    req.method === HTTPMethod.DELETE ||
    req.method === HTTPMethod.PATCH;

  if (isSafeMethod && !secretKey) {
    status = SecurityLevel.SAFE_METHOD_AND_NO_SECRET;
  }

  if (isProtectedMethod && !secretKey) {
    status = SecurityLevel.PROTECTED_METHOD_NO_SECRET_FOUND;
  }

  if (isProtectedMethod && secretKey) {
    status = SecurityLevel.PROTECTED_METHOD_AND_FOUND_SECRET;
  }

  return status;
};
