import faker from '@faker-js/faker';
import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { Request, Response } from 'express';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { TestService } from './test.service';
import bcrypt from 'bcryptjs';
import { COOKIE_CONSTANT } from '../../constants/cookie';
import { AuthService } from '../../auth/auth.service';
import { Public } from '../../auth/decorator/public.decorator';

@Public()
@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService
  ) {}

  @Post('/login')
  async forgeLogin(
    @Query('type') type: string,
    @Query('loggedIn') loggedIn: boolean,
    @Res() res: Response
  ) {
    const passwordRaw = faker.datatype.uuid();

    const { password, ...user } = await this.prismaService.user.create({
      data: {
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: bcrypt.hashSync(passwordRaw),
        roles: type === 'admin' ? [UserRole.ADMIN] : [],
      },
    });

    if (loggedIn) {
      return res
        .status(201)
        .cookie(
          COOKIE_CONSTANT.refresh.name,
          this.authService.generateRefreshToken(user).refresh_token,
          COOKIE_CONSTANT.refresh.options
        )
        .json({
          ...this.authService.generateAccessToken(user),
          user,
          passwordRaw,
        });
    } else {
      return res.status(201).json({
        user,
        passwordRaw,
      });
    }
  }

  @Post('/delete/all_bookings')
  async deleteAllBookings() {
    return await this.prismaService.booking.deleteMany({
      where: {
        id: {
          gt: 0,
        },
      },
    });
  }
}
