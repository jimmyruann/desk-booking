import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../../auth/auth.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TestController],
  providers: [TestService, PrismaService, UserService, AuthService],
})
export class TestModule {}
