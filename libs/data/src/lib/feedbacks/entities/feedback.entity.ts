import { ApiProperty } from '@nestjs/swagger';
import { Feedback } from '@prisma/client';
import { UserInfoEntity } from '../../users/entities/user.entity';

export class FeedbackEntity implements Feedback {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  User: UserInfoEntity;

  constructor(partial: Partial<FeedbackEntity>) {
    Object.assign(this, partial);
  }
}

export class FeedbackListEntity implements Partial<Feedback> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  User: UserInfoEntity;

  constructor(partial: Partial<FeedbackListEntity>) {
    Object.assign(this, partial);
  }
}
