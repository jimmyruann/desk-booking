import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Area, AreaType, Booking, Location } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  Min,
  Validate,
} from 'class-validator';

class BookingsTime {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @Validate(IsBeforeConstraint, ['endTime'])
  readonly startTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  readonly endTime: Date;
}

export class CreateBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly htmlId: string;

  @ApiProperty({
    type: () => [BookingsTime],
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => BookingsTime)
  readonly bookings: BookingsTime[];
}

export class FindAllBookingDto extends BookingsTime {
  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly skip: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    default: 20,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly take: number = 20;
}

export type CreateBookingResponse = Area & {
  readonly Location: Location;
  readonly Booking: Booking[];
};

export type FindOneBookingResponse = Booking & {
  Area: Area & {
    AreaType: AreaType;
    Location: Location;
  };
};

export type FindAllBookingResponse = (Booking & {
  Area: Area & {
    AreaType: AreaType;
    Location: Location;
  };
})[];

export function IsBeforeConstraint(IsBeforeConstraint: any, arg1: string[]) {
  throw new Error('Function not implemented.');
}

export type DeleteBookingResponse = Booking;
