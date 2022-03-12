import {
  CreateAreaDto,
  CreateAreaResponse,
  FindAllAreaResponse,
  FindOneAreaResponse,
  FindOneAreaWithBookingResponse,
} from '@desk-booking/data';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  private idOrHtmlId(id: string) {
    return /^-?\d+$/.test(id) ? { id: +id } : { htmlId: id };
  }

  async create(createAreaDto: CreateAreaDto): Promise<CreateAreaResponse> {
    return await this.prisma.area.create({
      data: createAreaDto,
    });
  }

  async findAllByLocation(location: string): Promise<FindAllAreaResponse> {
    return this.prisma.area.findMany({
      where: {
        Location: {
          name: location,
        },
      },
    });
  }

  async findOne(id: string): Promise<FindOneAreaResponse> {
    // able to use id or htmlId
    const query = /^-?\d+$/.test(id) ? { id: +id } : { htmlId: id };

    return await this.prisma.area.findUnique({
      where: query,
      include: {
        AreaType: true,
      },
    });
  }

  async findOneWithBookings(
    id: string,
    from: Date,
    to: Date
  ): Promise<FindOneAreaWithBookingResponse> {
    return await this.prisma.area.findUnique({
      where: this.idOrHtmlId(id),
      include: {
        Booking: {
          where: {
            startTime: {
              gte: from,
            },
            endTime: {
              lte: to,
            },
          },
          include: {
            User: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        AreaType: true,
        Location: true,
      },
    });
  }

  remove(id: string) {
    // able to use id or htmlId
    const query = /^-?\d+$/.test(id) ? { id: +id } : { htmlId: id };
    return this.prisma.area.delete({
      where: query,
    });
  }
}
