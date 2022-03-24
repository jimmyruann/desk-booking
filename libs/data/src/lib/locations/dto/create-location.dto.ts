import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty()
  locationId: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  timeZone: string;

  @ApiProperty()
  mapUrl: string;

  @ApiPropertyOptional({ default: 100 })
  capacity: number;

  @ApiPropertyOptional({ default: 0 })
  allowBookingFrom: number;

  @ApiPropertyOptional({ default: 1439 })
  allowBookingTill: number;
}
