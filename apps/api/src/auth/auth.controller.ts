import { SignupUserDto, UserEntity } from '@desk-booking/data';
import {
  All,
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { User } from './decorator/user.decorator';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: Express.User, @Req() req: Request, @Res() res: Response) {
    // By default, nestjs will create a req.user
    // simplest way to leverage express-session is to
    // pass req.user to req.session.user
    req.session.user = user;
    return res.status(HttpStatus.CREATED).json(req.user);
  }

  @All('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => null);
    res
      .status(HttpStatus.OK)
      .clearCookie('connect.sid', {
        maxAge: 0,
      })
      .json({
        message: 'You have logged out.',
      });
  }

  @ApiCreatedResponse({ type: UserEntity })
  @Post('signup')
  async signup(@Body() signupUserDto: SignupUserDto) {
    const user = await this.authService.signup(signupUserDto);
    return new UserEntity(user);
  }
}
