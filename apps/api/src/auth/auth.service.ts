import { SignupUserDto } from '@desk-booking/data';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { JWT_CONSTANT } from '../constants/jwt';
import { environment } from '../environments/environment';
import { PrismaService } from '../shared/prisma/prisma.service';
import { RefreshAuthPayLoad } from './auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;
    if (!bcrypt.compareSync(password, user.password)) return null;
    // Can add more condition if wanted (blacklisted, deactivated, etc)

    return user;
  }

  generateAccessToken(user: Express.User) {
    return {
      access_token: this.jwtService.sign(user, JWT_CONSTANT.access),
    };
  }

  generateRefreshToken(user: Express.User) {
    const jwtPayload: RefreshAuthPayLoad = { user, uuid: uuid() };
    // save the uuid
    return {
      refresh_token: this.jwtService.sign(jwtPayload, JWT_CONSTANT.refresh),
    };
  }

  async removeRefreshToken({ id }: Express.User) {
    return true;
  }

  async signup(signupUserDto: SignupUserDto) {
    // test hCaptcha first
    const { hCaptchaToken, password, ...rest } = signupUserDto;

    try {
      const { data: hCaptchaResult } = await axios.post<{ success: boolean }>(
        'https://hcaptcha.com/siteverify',
        `response=${hCaptchaToken}&secret=${environment.hCaptchaSecret}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (!hCaptchaResult.success) throw new Error();
    } catch (error) {
      throw new HttpException(
        `ReCaptcha failed, please try again.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const emailExist = await this.prisma.user.count({
      where: {
        email: rest.email,
      },
    });

    if (emailExist)
      throw new HttpException(
        `The email ${rest.email} already exist.`,
        HttpStatus.BAD_REQUEST
      );

    return await this.prisma.user.create({
      data: {
        ...rest,
        password: bcrypt.hashSync(password),
      },
    });
  }
}
