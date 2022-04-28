import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Request } from 'express';

export const Roles = (...args: string[]) => SetMetadata('roles', args);

export const IsAdmin = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return user.roles.includes(UserRole.ADMIN);
  }
);
