import { ApiProperty } from '@nestjs/swagger';

export class AreaAvailabilityEntity {
  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  booked: boolean;

  constructor(partial: Partial<AreaAvailabilityEntity>) {
    Object.assign(this, partial);
  }
}
