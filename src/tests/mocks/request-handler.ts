import type { Request, Response } from 'express';

export const reqMock = {
  generateCsrfToken: jest.fn(),
  setCookie: jest.fn(),
  cookie: jest.fn(),
  cookies: {},
  body: {},
  query: {},
  headers: {},
  params: {},
  csrfToken: jest.fn()
    .mockReturnValue('mocked-token'),
} as unknown as Request;

export const resMock = {
  cookie: jest.fn(),
  setHeader: jest.fn(),
} as unknown as Response;
