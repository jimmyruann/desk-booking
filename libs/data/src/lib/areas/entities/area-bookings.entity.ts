import { ApiProperty } from '@nestjs/swagger';
import { BookingEntity } from '../../bookings/entities/bookings.entity';

class AreaBookingUserEntity {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;
}

export class AreaBookingsEntity extends BookingEntity {
  @ApiProperty()
  User: AreaBookingUserEntity;

  constructor(partial: Partial<AreaBookingsEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
