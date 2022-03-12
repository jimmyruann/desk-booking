import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Area, AreaType, Booking, Location } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Validate,
} from 'class-validator';
import { IsBeforeConstraint } from './booking';

export class CreateAreaDto implements Omit<Area, 'id'> {
  @ApiProperty()
  @IsNotEmpty()
  htmlId: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  locationId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  areaTypeId: number;

  @ApiPropertyOptional({
    default: true,
  })
  @IsBoolean()
  allowBooking: boolean;
}

export class FindOneWithBookingQuery {
  @ApiProperty()
  @Type(() => Date)
  @IsNotEmpty()
  @Validate(IsBeforeConstraint, ['to'])
  from: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsNotEmpty()
  to: Date;
}

export type CreateAreaResponse = Area;

export type FindOneAreaResponse = Area & {
  AreaType: AreaType;
};

export type FindAllAreaResponse = Area[];

export type FindOneAreaWithBookingResponse = Area & {
  AreaType: AreaType;
  Booking: (Booking & {
    User: {
      firstName: string;
      lastName: string;
    };
  })[];
  Location: Location;
};
