// import { Controller, Post, Query, Res, UseGuards } from '@nestjs/common';
// import { UserRole } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import { Response } from 'express';
// import { v4 as uuid } from 'uuid';
// import { AuthService } from '../../auth/auth.service';
// import { Public } from '../../auth/decorator/public.decorator';
// import { TestGuard } from '../../auth/guards/test.guard';
// import { COOKIE_CONSTANT } from '../../constants/cookie';
// import { PrismaService } from '../../shared/prisma/prisma.service';
// import { UserService } from '../user/user.service';
// import { TestService } from './test.service';

// @Public()
// @UseGuards(TestGuard)
// @Controller('test')
// export class TestController {
//   constructor(
//     private readonly testService: TestService,
//     private readonly userService: UserService,
//     private readonly prismaService: PrismaService,
//     private readonly authService: AuthService
//   ) {}

//   @Post('/login')
//   async forgeLogin(
//     @Query('type') type: string,
//     @Query('loggedIn') loggedIn: boolean,
//     @Res() res: Response
//   ) {
//     const passwordRaw = uuid();

//     const { password, ...user } = await this.prismaService.user.upsert({
//       where: {
//         email: 'john.smith@example.com',
//       },
//       update: {
//         firstName: 'John',
//         lastName: 'Smith',
//         password: bcrypt.hashSync(passwordRaw),
//         roles: type === 'admin' ? [UserRole.ADMIN] : [],
//       },
//       create: {
//         email: 'john.smith@example.com',
//         firstName: 'John',
//         lastName: 'Smith',
//         password: bcrypt.hashSync(passwordRaw),
//         roles: type === 'admin' ? [UserRole.ADMIN] : [],
//       },
//     });

//     if (loggedIn) {
//       return res
//         .status(201)
//         .cookie(
//           COOKIE_CONSTANT.refresh.name,
//           this.authService.generateRefreshToken(user).refresh_token,
//           COOKIE_CONSTANT.refresh.options
//         )
//         .json({
//           ...this.authService.generateAccessToken(user),
//           user,
//           passwordRaw,
//         });
//     } else {
//       return res.status(201).json({
//         user,
//         passwordRaw,
//       });
//     }
//   }

//   @Post('/delete/all_bookings')
//   async deleteAllBookings() {
//     return await this.prismaService.booking.deleteMany({
//       where: {
//         id: {
//           gt: 0,
//         },
//       },
//     });
//   }
// }
