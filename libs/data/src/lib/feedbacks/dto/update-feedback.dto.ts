import { PartialType } from '@nestjs/swagger';
import { CreateFeedbackDto } from './create-feedback.dto';

export class UpdateAreaDto extends PartialType(CreateFeedbackDto) {}
