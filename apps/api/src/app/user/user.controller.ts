import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';

import { UserRole } from '@prisma/client';
import { RolesGuard } from '../../auth/guards/role.guard';
import { User } from '../../auth/decorator/user.decorator';
import { Roles } from '../../auth/decorator/roles.decorator';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findMe(@User() user: Express.User) {
    return user;
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Get('all')
  findAll(@Query('skip') skip: string, @Query('take') take: string) {
    return this.userService.findAll(+skip, +take);
  }
}
