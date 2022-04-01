import { Module } from '@nestjs/common';
import { AuthModuleOptions, PassportModule } from '@nestjs/passport';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionStrategy } from './strategies/session.strategy';

@Module({
  imports: [PassportModule, AuthModuleOptions],
  providers: [AuthService, PrismaService, LocalStrategy, SessionStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
