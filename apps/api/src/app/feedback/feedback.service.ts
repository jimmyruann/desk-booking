import {
  CreateFeedbackDto,
  CreateFeedbackReturn,
  FindAllFeedbackReturn,
  FindOneFeedbackReturn,
} from '@desk-booking/data';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createFeedbackDto: CreateFeedbackDto
  ): Promise<CreateFeedbackReturn> {
    return await this.prisma.feedback.create({
      data: {
        userId,
        ...createFeedbackDto,
      },
    });
  }

  async findOne(id: number): Promise<FindOneFeedbackReturn> {
    return await this.prisma.feedback.findUnique({
      where: { id },
      include: {
        User: true,
      },
    });
  }

  async findAll(): Promise<FindAllFeedbackReturn> {
    return await this.prisma.feedback.findMany({
      include: {
        User: true,
      },
    });
  }
}
