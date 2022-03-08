import { All, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { User } from './decorator/user.decorator';
import { LocalAuthGuard } from './guards/local.guard';
import { COOKIE_CONSTANT } from '../constants/cookie';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard';
import { Public } from './decorator/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANT } from '../constants/jwt';
import { cleanJWT } from '../shared/helper/cleanJwt';

@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: Express.User, @Res() res: Response) {
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
  refresh(@User() user: Express.User) {
    return {
      ...this.authService.generateAccessToken(user),
      user,
    };
  }

  @All('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    if (req.cookies[COOKIE_CONSTANT.refresh.name]) {
      const user = await this.jwtService.verifyAsync<Express.User>(
        req.cookies[COOKIE_CONSTANT.refresh.name],
        {
          secret: JWT_CONSTANT.refresh.secret,
        }
      );

      await this.authService.removeRefreshToken(cleanJWT(user));
    }

    return res
      .status(200)
      .clearCookie(COOKIE_CONSTANT.refresh.name, {
        maxAge: 0,
      })
      .json({
        message: 'You have logged out.',
      });
  }
}
