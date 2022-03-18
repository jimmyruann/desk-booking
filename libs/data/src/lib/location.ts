import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Location } from '@prisma/client';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsNotEmpty()
  locationId: string;

  @ApiProperty()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty()
  @IsNotEmpty()
  timeZone: string;

  @ApiProperty()
  @IsNotEmpty()
  mapUrl: string;

  @ApiProperty()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  capacity: number;

  @ApiProperty()
  @Min(0)
  @Max(24 * 60 - 1)
  @IsNotEmpty()
  allowBookingFrom: number;

  @ApiProperty()
  @Min(1)
  @Max(24 * 60)
  @IsNotEmpty()
  allowBookingTill: number;
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}

export type FindOneLocationReturn = Location;
export type FindAllLocationReturn = Location[];
export type UpdateLocationResponse = Location;
