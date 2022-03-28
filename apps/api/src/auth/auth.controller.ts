import { SignupUserDto, UserEntity } from '@desk-booking/data';
import {
  All,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { COOKIE_CONSTANT } from '../constants/cookie';
import { JWT_CONSTANT } from '../constants/jwt';
import { cleanJWT } from '../shared/helper/cleanJwt';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { User } from './decorator/user.decorator';
import { LocalAuthGuard } from './guards/local.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard';

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

  @ApiCreatedResponse({ type: UserEntity })
  @Post('signup')
  async signup(@Body() signupUserDto: SignupUserDto) {
    const user = await this.authService.signup(signupUserDto);
    return new UserEntity(user);
  }
}
