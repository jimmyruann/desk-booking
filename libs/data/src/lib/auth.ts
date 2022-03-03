import { User } from '@prisma/client';

export type ExpressUser = Omit<User, 'password'>;

export type LoginReturn = {
  access_token: string;
  user: ExpressUser;
};

export type RefreshTokenReturn = LoginReturn;
