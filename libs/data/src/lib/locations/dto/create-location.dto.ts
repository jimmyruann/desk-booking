import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Location } from '@prisma/client';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateLocationDto implements Omit<Location, 'id'> {
  @ApiProperty()
  locationId: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  timeZone: string;

  @ApiProperty()
  mapUrl: string;

  @ApiPropertyOptional({ default: 100, minimum: 0, maximum: 100 })
  @Min(0)
  @Max(100)
  @IsNumber()
  capacity: number;

  @ApiPropertyOptional({ default: 0 })
  allowBookingFrom: number;

  @ApiPropertyOptional({ default: 1439 })
  allowBookingTill: number;

  @ApiProperty({ default: false })
  disabled: boolean;
}
