import { CreateFeedbackDto } from '@desk-booking/data';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createFeedbackDto: CreateFeedbackDto) {
    return await this.prisma.feedback.create({
      data: {
        userId,
        ...createFeedbackDto,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.feedback.findUnique({
      where: { id },
      include: {
        User: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.feedback.findMany({
      include: {
        User: true,
      },
    });
  }
}
