import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANT } from '../../constants/jwt';
import { cleanJWT } from '../../shared/helper/cleanJwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANT.access.secret,
    });
  }

  async validate(payload: Express.User) {
    return cleanJWT(payload);
  }
}
