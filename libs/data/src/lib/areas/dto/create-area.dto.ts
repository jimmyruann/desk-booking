import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, Min } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty()
  @IsNotEmpty()
  htmlId: string;

  @ApiPropertyOptional()
  displayName: string;

  @ApiProperty()
  @Type(() => Number)
  @Min(1)
  locationId: number;

  @ApiProperty()
  @Type(() => Number)
  @Min(1)
  areaTypeId: number;

  @ApiPropertyOptional({
    default: true,
  })
  @IsBoolean()
  allowBooking: boolean;
}
