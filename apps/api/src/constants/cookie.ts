import { CookieOptions } from 'express';
import ms from 'ms';

const refreshOptions: CookieOptions = {
  maxAge: ms('7d'),
  httpOnly: false,
  sameSite: 'lax',
};

export const COOKIE_CONSTANT = {
  refresh: {
    name: 'refresh',
    options: refreshOptions,
  },
};
