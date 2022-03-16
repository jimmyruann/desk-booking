import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../auth/decorator/roles.decorator';
import { User } from '../../auth/decorator/user.decorator';
import { RolesGuard } from '../../auth/guards/role.guard';
import { UserService } from './user.service';

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
