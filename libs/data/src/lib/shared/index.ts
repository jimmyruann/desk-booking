import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

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
