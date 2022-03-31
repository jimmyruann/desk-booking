import { ApiProperty } from '@nestjs/swagger';
import { AreaType } from '@prisma/client';

export class AreaTypeEntity implements AreaType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  interval: number;

  constructor(partial: Partial<AreaTypeEntity>) {
    Object.assign(this, partial);
  }
}
