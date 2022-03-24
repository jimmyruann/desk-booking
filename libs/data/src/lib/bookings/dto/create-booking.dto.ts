import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, Validate } from 'class-validator';
import { IsBeforeConstraint } from './IsBeforeConstraint';

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
