import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: UserRole, isArray: true })
  roles: UserRole[];

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = partial;
    Object.assign(this, rest);
  }
}
