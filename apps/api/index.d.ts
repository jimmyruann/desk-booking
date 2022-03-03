import { UserRole } from '@prisma/client';
import { ExpressUser } from '@desk-booking/data';

declare global {
  namespace Express {
    interface User extends ExpressUser {
      id: number;
      email: string;
      username: string;
      roles: UserRole[];
      firstName: string;
      lastName: string;
    }
  }
}
