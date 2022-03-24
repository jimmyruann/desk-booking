import { ApiProperty } from '@nestjs/swagger';
import { Area } from '@prisma/client';
import { LocationEntity } from '../../locations';

export class AreaEntity implements Area {
  @ApiProperty()
  id: number;

  @ApiProperty()
  htmlId: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  locationId: number;

  @ApiProperty()
  areaTypeId: number;

  @ApiProperty({ default: true })
  allowBooking: boolean;

  constructor(partial: Partial<AreaEntity>) {
    Object.assign(this, partial);
  }
}

export class AreaWithLocationEntity extends AreaEntity {
  @ApiProperty()
  Location: LocationEntity;

  constructor(partial: Partial<AreaWithLocationEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
