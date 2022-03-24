import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends ExpressUser {
      id: number;
      email: string;
      roles: UserRole[];
      firstName: string;
      lastName: string;
    }
  }
}
