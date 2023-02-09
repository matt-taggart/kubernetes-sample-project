import { Response } from 'express';

export const setRefreshTokenCookie = (
  response: Response,
  refreshToken: string,
) => {
  // One Week
  const COOKIE_AGE = 24 * 60 * 60 * 1000;

  response.cookie('cc_auth', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: COOKIE_AGE,
  });
};
