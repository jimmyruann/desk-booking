import { ApiProperty } from '@nestjs/swagger';
import { Feedback } from '@prisma/client';

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

  constructor(partial: Partial<FeedbackEntity>) {
    Object.assign(this, partial);
  }
}
