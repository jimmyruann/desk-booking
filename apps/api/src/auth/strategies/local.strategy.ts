import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<Express.User> {
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Invalid login credentials.');
    delete user['password'];
    return user;
  }
}
