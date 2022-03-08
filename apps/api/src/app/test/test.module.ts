import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { TestGuard } from '../../auth/guards/test.guard';
import { UserService } from '../user/user.service';
import { AuthService } from '../../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TestController],
  providers: [
    TestService,
    PrismaService,
    UserService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: TestGuard,
    },
  ],
})
export class TestModule {}
