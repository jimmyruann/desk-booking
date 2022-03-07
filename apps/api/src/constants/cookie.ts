import { CookieOptions } from 'express';
import ms from 'ms';
import { environment } from '../environments/environment';

const refreshOptions: CookieOptions = {
  maxAge: ms(environment.JWT.REFRESH_EXPIRE),
  httpOnly: environment.production,
  sameSite: 'strict',
};

export const COOKIE_CONSTANT = {
  refresh: {
    name: environment.JWT.REFRESH_NAME,
    options: refreshOptions,
  },
};
