import { UserEntity } from '@desk-booking/data';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({ summary: `[USER, ADMIN] Who am I?` })
  @ApiOkResponse({ type: UserEntity })
  findMe(@User() user: Express.User) {
    return new UserEntity(user);
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: `[ADMIN] Find one user` })
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    return new UserEntity(await this.userService.findOne(+id));
  }

  @Roles(UserRole.ADMIN)
  @Get('all')
  @ApiOperation({ summary: `[ADMIN] Find all users` })
  @ApiOkResponse({ type: [UserEntity] })
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => new UserEntity(user));
  }
}
