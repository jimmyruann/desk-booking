import { CreateBookingDto } from '@desk-booking/data';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return await this.prisma.booking.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await this.prisma.booking.findMany();
  }

  async remove(id: number) {
    return await this.prisma.booking.delete({
      where: { id },
    });
  }

  // async findAll(
  //   userId: number,
  //   { startTime, endTime, skip, take }: FindAllBookingDto
  // ): Promise<FindAllBookingResponse> {
  //   return await this.prisma.booking.findMany({
  //     where: {
  //       userId: userId,
  //       startTime: {
  //         gte: startTime,
  //       },
  //       endTime: {
  //         lt: endTime,
  //       },
  //     },
  //     include: {
  //       Area: {
  //         include: {
  //           AreaType: true,
  //           Location: true,
  //         },
  //       },
  //     },
  //     skip,
  //     take,
  //     orderBy: {
  //       startTime: 'asc',
  //     },
  //   });
  // }

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

  // async remove(userId: number, id: number): Promise<DeleteBookingResponse> {
  //   const exist = await this.prisma.booking.count({
  //     where: {
  //       userId,
  //       id,
  //     },
  //   });

  //   if (!exist)
  //     throw new HttpException(
  //       `Booking ID ${id} not found in your record.`,
  //       HttpStatus.NOT_FOUND
  //     );

  //   const deleted = await this.prisma.booking.delete({
  //     where: { id },
  //   });

  //   return deleted;
  // }

  async createWithUser(userId: number, { htmlId, bookings }: CreateBookingDto) {
    //  prevent double booking for single area
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

    // get htmlId area
    const area = await this.prisma.area.findUnique({
      where: {
        htmlId,
      },
      include: {
        AreaType: true,
      },
    });

    // // One person can onl book 1 desk/room at a time
    // const hasBookedOther = await this.prisma.booking.count({
    //   where: {
    //     userId,
    //     Area: {
    //       AreaType: {
    //         name: area.AreaType.name,
    //       },
    //     },
    //     OR: bookings.map((booking) => ({
    //       startTime: {
    //         lt: booking.endTime,
    //       },
    //       endTime: {
    //         gt: booking.startTime,
    //       },
    //     })),
    //   },
    // });

    // if (hasBookedOther)
    //   throw new HttpException(
    //     {
    //       title: `One ${area.AreaType.name} at a time`,
    //       message: `You have already booked ${htmlId} at this time.`,
    //     },
    //     HttpStatus.BAD_REQUEST
    //   );

    // https://github.com/prisma/prisma/issues/8131#issuecomment-997667070
    const createBookings = await this.prisma.$transaction(
      bookings.map((booking) =>
        this.prisma.booking.create({
          data: {
            ...booking,
            userId,
            areaId: area.id,
          },
        })
      )
    );
    return createBookings;
  }

  async findOneWithUser(userId: number, id: number) {
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

  async findAllWithUser(userId: number) {
    return await this.prisma.booking.findMany({
      where: {
        userId,
      },
    });
  }

  async removeWithUser(userId: number, id: number) {
    const exist = await this.prisma.booking.count({
      where: {
        userId,
        id,
      },
    });

    if (!exist)
      throw new HttpException(
        `Booking ID ${id} not found in your record.`,
        HttpStatus.NOT_FOUND
      );

    const deleted = await this.prisma.booking.delete({
      where: { id },
    });

    return deleted;
  }

  async findAllWithUserAndArea(userId: number, startTime: Date, endTime: Date) {
    return await this.prisma.booking.findMany({
      where: {
        userId,
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
            Location: true,
          },
        },
      },
    });
  }
}
