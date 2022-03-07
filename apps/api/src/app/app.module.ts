import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { AreasModule } from './areas/areas.module';
import { LocationsModule } from './locations/locations.module';
import { UserModule } from './user/user.module';
import { AreaTypesModule } from './area-types/area-types.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FeedbackModule } from './feedback/feedback.module';

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
