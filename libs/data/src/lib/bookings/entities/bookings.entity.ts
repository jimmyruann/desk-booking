import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '@prisma/client';

export class BookingEntity implements Booking {
  @ApiProperty()
  id: number;

  @ApiProperty()
  areaId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<BookingEntity>) {
    Object.assign(this, partial);
  }
}
