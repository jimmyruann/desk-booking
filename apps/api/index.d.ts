import { User as U, UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends Omit<U, 'password'> {
      id: number;
      email: string;
      username: string;
      roles: UserRole[];
      firstName: string;
      lastName: string;
    }
  }
}
