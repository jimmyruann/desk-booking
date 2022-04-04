import { SignupUserDto, UserEntity } from '@desk-booking/data';
import {
  All,
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SessionData } from 'express-session';
import { environment } from '../environments/environment';
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
  login(
    @User() user: Express.User,
    @Session() session: SessionData,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // By default, nestjs will create a req.user
    // simplest way to leverage express-session is to
    // pass req.user to req.session.user
    session.user = user;
    res.status(HttpStatus.CREATED).json(session.user);
  }

  @All('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => null);
    res.status(HttpStatus.OK).clearCookie(environment.appSessionName, {
      maxAge: 0,
    });
  }

  @ApiCreatedResponse({ type: UserEntity })
  @Post('signup')
  async signup(@Body() signupUserDto: SignupUserDto) {
    const user = await this.authService.signup(signupUserDto);
    return new UserEntity(user);
  }
}
