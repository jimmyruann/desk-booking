import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { AreasModule } from './areas/areas.module';
import { LocationsModule } from './locations/locations.module';
import { UserModule } from './user/user.module';
import { AreaTypesModule } from './area-types/area-types.module';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Module({
  imports: [
    BookingsModule,
    AreasModule,
    LocationsModule,
    UserModule,
    AreaTypesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
