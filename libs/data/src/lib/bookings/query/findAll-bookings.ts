import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaginateQuery } from '../../shared';

export class FindAllBookingsQuery extends PartialType(PaginateQuery) {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly startTime: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly endTime: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly userId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly locationId: string;
}
