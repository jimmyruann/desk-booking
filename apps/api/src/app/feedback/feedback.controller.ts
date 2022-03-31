import { CreateFeedbackDto, FeedbackEntity } from '@desk-booking/data';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../../auth/decorator/roles.decorator';
import { User } from '../../auth/decorator/user.decorator';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Create new Feedback' })
  @ApiCreatedResponse({ type: FeedbackEntity })
  async create(
    @User() user: Express.User,
    @Body() createFeedbackDto: CreateFeedbackDto
  ) {
    return new FeedbackEntity(
      await this.feedbackService.create(+user.id, createFeedbackDto)
    );
  }

  @Roles(UserRole.ADMIN)
  @Get('list')
  @ApiOperation({ summary: '[ADMIN] Get Feedback list' })
  @ApiOkResponse({ type: [FeedbackEntity] })
  async getList() {
    const feedbacks = await this.feedbackService.getList();
    return feedbacks.map((feedback) => new FeedbackEntity(feedback));
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: '[ADMIN] Find one feedback' })
  @ApiOkResponse({ type: FeedbackEntity })
  async findOne(@Param('id') id: string) {
    return new FeedbackEntity(await this.feedbackService.findOne(+id));
  }

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: '[ADMIN] Find all feedbacks' })
  @ApiOkResponse({ type: [FeedbackEntity] })
  async findAll() {
    const feedbacks = await this.feedbackService.findAll();
    return feedbacks.map((feedback) => new FeedbackEntity(feedback));
  }
}
