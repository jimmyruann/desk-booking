import { SignupUserDto } from '@desk-booking/data';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { environment } from '../environments/environment';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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
