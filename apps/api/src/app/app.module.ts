import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreaTypesModule } from './area-types/area-types.module';
import { AreasModule } from './areas/areas.module';
import { BookingsModule } from './bookings/bookings.module';
import { FeedbackModule } from './feedback/feedback.module';
import { LocationsModule } from './locations/locations.module';
// import { TestModule } from './test/test.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
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
    // TestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
