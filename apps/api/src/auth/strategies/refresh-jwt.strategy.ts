import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshAuthPayLoad } from '../auth.type';
import { Request } from 'express';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { COOKIE_CONSTANT } from '../../constants/cookie';
import { JWT_CONSTANT } from '../../constants/jwt';
import { cleanJWT } from '../../shared/helper/cleanJwt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt'
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req || !req.cookies) return null;
        return req.cookies[COOKIE_CONSTANT.refresh.name];
      },
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANT.refresh.secret,
    });
  }

  async validate({ user, uuid }: RefreshAuthPayLoad): Promise<Express.User> {
    if (!user) throw new UnauthorizedException();
    // check uuid against database if its good

    return cleanJWT(user);
  }
}
