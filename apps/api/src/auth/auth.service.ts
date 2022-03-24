import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { JWT_CONSTANT } from '../constants/jwt';
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
}
