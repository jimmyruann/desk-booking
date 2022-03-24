import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModuleOptions, PassportModule } from '@nestjs/passport';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({}), AuthModuleOptions],
  providers: [
    AuthService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
