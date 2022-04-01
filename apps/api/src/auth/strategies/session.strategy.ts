import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy as CustomStrategy } from 'passport-custom';

/**
 * This strategy is for validating user sessions
 * For express-session
 */

const strategyKey = 'session';

@Injectable()
export class SessionStrategy extends PassportStrategy(
  CustomStrategy,
  strategyKey
) {
  static key = strategyKey;

  validate(req: Request): Express.User {
    if (!req.session.user)
      throw new UnauthorizedException(
        'Please login before accessing resource.'
      );

    return req.session.user;
  }
}
