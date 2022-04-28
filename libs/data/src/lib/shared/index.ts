import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FindOneParams {
  @ApiProperty({
    type: Number,
  })
  @IsNumberString()
  id: number;
}

export class FindOneStringParams {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;
}

export class PaginateQuery {
  @ApiProperty({
    default: 50,
    type: Number,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly take: number = 50;

  @ApiProperty({
    default: 0,
    type: Number,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly skip: number = 0;
}
