import { ApiProperty } from '@nestjs/swagger';
import { Feedback, User } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  message: string;
}

export type CreateFeedbackReturn = Feedback;
export type FindOneFeedbackReturn = Feedback & {
  User: User;
};
export type FindAllFeedbackReturn = FindOneFeedbackReturn[];
