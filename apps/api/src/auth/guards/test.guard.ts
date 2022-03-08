import { CanActivate, Injectable } from '@nestjs/common';
import { environment } from '../../environments/environment';

@Injectable()
export class TestGuard implements CanActivate {
  canActivate(): boolean {
    return !environment.production;
  }
}
