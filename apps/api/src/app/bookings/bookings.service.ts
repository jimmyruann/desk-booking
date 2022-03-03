import {
  CreateBookingDto,
  CreateBookingReturn,
  FindAllBookingDto,
  FindAllBookingReturn,
  FindOneBookingReturn,
} from '@desk-booking/data';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    { htmlId, bookings }: CreateBookingDto
  ): Promise<CreateBookingReturn> {
    //  prevent double booking
    const conflicts = await this.prisma.booking.count({
      where: {
        Area: {
          htmlId,
        },
        OR: bookings.map((booking) => ({
          startTime: {
            lt: booking.endTime,
          },
          endTime: {
            gt: booking.startTime,
          },
        })),
      },
    });

    if (conflicts)
      throw new HttpException(
        'The booking time are taken.',
        HttpStatus.BAD_REQUEST
      );

    // One person can onl book 1 desk/room at a time
    const entityType = await this.prisma.area.findUnique({
      where: {
        htmlId,
      },
      select: {
        AreaType: true,
      },
    });

    const hasBookedOther = await this.prisma.booking.count({
      where: {
        userId,
        Area: {
          AreaType: {
            name: entityType.AreaType.name,
          },
        },
        OR: bookings.map((booking) => ({
          startTime: {
            lt: booking.endTime,
          },
          endTime: {
            gt: booking.startTime,
          },
        })),
      },
    });

    if (hasBookedOther)
      throw new HttpException(
        `You can only book 1 ${entityType.AreaType.name} at a time.`,
        HttpStatus.BAD_REQUEST
      );

    return this.prisma.area.update({
      where: {
        htmlId,
      },
      data: {
        Booking: {
          createMany: {
            data: bookings.map((each) => ({
              userId,
              ...each,
            })),
          },
        },
      },
      include: {
        Booking: true,
        Location: true,
      },
    });
  }

  findAll(
    userId: number,
    { startTime, endTime, skip, take }: FindAllBookingDto
  ): Promise<FindAllBookingReturn> {
    return this.prisma.booking.findMany({
      where: {
        userId: userId,
        startTime: {
          gte: startTime,
        },
        endTime: {
          lt: endTime,
        },
      },
      include: {
        Area: {
          include: {
            AreaType: true,
            Location: true,
          },
        },
      },
      skip,
      take,
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOne(userId: number, id: number): Promise<FindOneBookingReturn> {
    return await this.prisma.booking.findFirst({
      where: { id, userId },
      include: {
        Area: {
          include: {
            AreaType: true,
            Location: true,
          },
        },
      },
    });
  }

  // update(id: number, updateBookingDto: UpdateBookingDto) {
  //   // https://stackoverflow.com/questions/38090387/scenario-to-allow-update-based-on-booking-sql
  //   // return this.prisma.booking.update({
  //   //   where: { id },
  //   //   data: updateBookingDto,
  //   // });
  //   throw new HttpException(
  //     "This endpoint hasn't been implemented.",
  //     HttpStatus.NOT_IMPLEMENTED
  //   );
  // }

  remove(userId: number, id: number) {
    return this.prisma.booking.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}
