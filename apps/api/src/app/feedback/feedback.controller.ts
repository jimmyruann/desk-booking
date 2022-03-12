import { CreateFeedbackDto } from '@desk-booking/data';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Feedback, UserRole } from '@prisma/client';
import { Roles } from '../../auth/decorator/roles.decorator';
import { User } from '../../auth/decorator/user.decorator';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(
    @User() user: Express.User,
    @Body() createFeedbackDto: CreateFeedbackDto
  ): Promise<Feedback> {
    return await this.feedbackService.create(+user.id, createFeedbackDto);
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.feedbackService.findOne(+id);
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Get()
  async findAll() {
    return await this.feedbackService.findAll();
  }
}
