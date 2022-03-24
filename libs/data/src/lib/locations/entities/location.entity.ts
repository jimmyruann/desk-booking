import { ApiProperty } from '@nestjs/swagger';
import { Location } from '@prisma/client';

export class LocationEntity implements Location {
  @ApiProperty()
  id: number;

  @ApiProperty()
  locationId: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  timeZone: string;

  @ApiProperty()
  mapUrl: string;

  @ApiProperty({ default: 100 })
  capacity: number;

  @ApiProperty({ default: 0 })
  allowBookingFrom: number;

  @ApiProperty({ default: 1439 })
  allowBookingTill: number;

  constructor(partial: Partial<LocationEntity>) {
    Object.assign(this, partial);
  }
}
