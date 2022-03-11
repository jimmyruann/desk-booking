import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TestController],
  providers: [TestService, PrismaService, UserService, AuthService],
})
export class TestModule {}
