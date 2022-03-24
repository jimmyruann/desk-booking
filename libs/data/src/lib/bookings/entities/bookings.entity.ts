import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '@prisma/client';
import { AreaWithLocationEntity } from '../../areas/entities/areas.entity';

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

export class BookingWithAreaEntity extends BookingEntity {
  @ApiProperty()
  Area: AreaWithLocationEntity;

  constructor(partial: Partial<BookingWithAreaEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
