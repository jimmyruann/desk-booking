import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Area, AreaType, Booking } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, Validate } from 'class-validator';
import dayjs from 'dayjs';
import { IsBeforeConstraint } from './booking';

export class CreateAreaDto implements Omit<Area, 'id'> {
  @ApiProperty()
  @IsNotEmpty()
  htmlId: string;

  @ApiPropertyOptional()
  name: string;

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

export type CreateAreaReturn = Area;

export type FindOneReturn = Area & {
  AreaType: AreaType;
};

export type FindAllAreaReturn = Area[];

export type AreaFindOneWithBookingReturn = Area & {
  AreaType: AreaType;
  Booking: (Booking & {
    User: {
      firstName: string;
      lastName: string;
    };
  })[];
};
