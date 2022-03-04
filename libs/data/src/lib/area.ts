import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Area, AreaType, Booking } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import dayjs from 'dayjs';

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

export type CreateAreaReturn = Area;

export type FindOneReturn = Area & {
  AreaType: AreaType;
};

export type FindAllLocationReturn = Area[];

export type FindOneWithBookingReturn = Area & {
  Booking: Booking[];
  AreaType: AreaType;
};
