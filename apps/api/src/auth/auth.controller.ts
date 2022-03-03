import { All, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { User } from './decorator/user.decorator';
import { LocalAuthGuard } from './guards/local.guard';
import { COOKIE_CONSTANT } from '../constants/cookie';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard';
import { Public } from './decorator/public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: Express.User, @Res() res: Response) {
    // Issue refresh token and set in cookies
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
      });
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(@User() user: Express.User) {
    return {
      ...this.authService.generateAccessToken(user),
      user,
    };
  }

  @UseGuards(RefreshJwtAuthGuard)
  @All('logout')
  async logout(@User() user: Express.User, @Res() res: Response) {
    await this.authService.removeRefreshToken(user);
    return res
      .status(200)
      .cookie(COOKIE_CONSTANT.refresh.name, null, {
        ...COOKIE_CONSTANT.refresh.options,
        maxAge: 0,
        expires: new Date(),
      })
      .json({
        message: 'bye',
      });
  }
}
