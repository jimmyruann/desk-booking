import { UserRole } from '@prisma/client';

interface IUser {
  id: number;
  email: string;
  roles: UserRole[];
  firstName: string;
  lastName: string;
}

declare global {
  namespace Express {
    type User = IUser;
  }
}

declare module 'express-session' {
  interface SessionData {
    user: IUser;
  }
}
