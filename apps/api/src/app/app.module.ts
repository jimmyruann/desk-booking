import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '../auth/auth.module';
import { SessionGuard } from '../auth/guards/session.guard';
import { PrismaClientExceptionFilter } from '../shared/prisma/prisma-client-exception.filter';
import { RedisModule } from '../shared/redis/redis.module';
import { RedisService } from '../shared/redis/redis.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreaTypesModule } from './area-types/area-types.module';
import { AreasModule } from './areas/areas.module';
import { BookingsModule } from './bookings/bookings.module';
import { FeedbackModule } from './feedback/feedback.module';
import { LocationsModule } from './locations/locations.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RedisModule,
    BookingsModule,
    AreasModule,
    LocationsModule,
    UserModule,
    AreaTypesModule,
    AuthModule,
    FeedbackModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 50,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisService,
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
})

// export class AppModule implements NestModule {
//   constructor(private readonly redisService: RedisService) {}

//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(
//         session({
//           name: 'hd_sid',
//           store: this.redisService.getRedisStore(),
//           secret: environment.appSessionSecret,
//           saveUninitialized: false,
//           resave: false,
//           unset: 'destroy',
//           genid: () => uuid(),
//           cookie: {
//             httpOnly: false,
//             maxAge: ms('3d'),
//             secure: true,
//             sameSite: 'none',
//           },
//         })
//       )
//       .forRoutes('*');
//   }
// }
export class AppModule {}
