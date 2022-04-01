import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler()
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<Request>();
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}

@Injectable()
export class ManagementOnly implements CanActivate {
  private managementRoles = [UserRole.ADMIN, UserRole.MANAGER];

  canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest<Request>();
    return this.managementRoles.some((role) => user.roles.includes(role));
  }
}
