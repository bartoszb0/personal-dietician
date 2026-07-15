import { CookieOptions } from 'express';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export const JWT_SECRET = process.env.JWT_SECRET;

export const AUTH_COOKIE_NAME = 'access_token';

export function getCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  };
}
