import { CreateBookingDto, FindAllBookingsQuery } from '@desk-booking/data';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AreaType, Location, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class BookingsService {
  private include = {
    User: {
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    },
    Area: {
      include: {
        Location: true,
      },
    },
  };

  constructor(private prisma: PrismaService) {}

  async findOne(where: { id: number; userId?: number }) {
    return await this.prisma.booking.findFirst({
      where,
      include: this.include,
    });
  }

  async findAll({
    startTime,
    endTime,
    locationId,
    take,
    skip,
    userId,
  }: FindAllBookingsQuery) {
    const commonQuery: {
      where: Prisma.BookingWhereInput;
      orderBy: Prisma.Enumerable<Prisma.BookingOrderByWithRelationInput>;
    } = {
      where: {
        userId,
        startTime: {
          gte: new Date(startTime),
        },
        endTime: {
          lt: new Date(endTime),
        },
        Area: {
          Location: {
            locationId: locationId,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    };

    const count = await this.prisma.booking.count(commonQuery);
    const data = await this.prisma.booking.findMany({
      ...commonQuery,
      take,
      skip,
      include: this.include,
    });

    return {
      count,
      data,
    };
  }

  async removeOne({ id, userId }: { id: number; userId?: number }) {
    const count = await this.prisma.booking.count({
      where: {
        id,
        userId,
      },
    });

    if (count !== 1)
      throw new HttpException(
        {
          title: `Booking Not Found`,
          message: `Unable to find the booking you want to delete.`,
        },
        HttpStatus.BAD_REQUEST
      );

    return await this.prisma.booking.delete({
      where: {
        id,
      },
      include: this.include,
    });
  }

  async createOne(userId: number, createBookingDto: CreateBookingDto) {
    const bookingTime = createBookingDto.bookings.map((booking) => ({
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
    }));

    const hasConflict = await this.hadConflict({
      htmlId: createBookingDto.htmlId,
      bookingTime,
    });
    if (hasConflict) {
      throw new HttpException(
        'The booking time are taken.',
        HttpStatus.BAD_REQUEST
      );
    }

    const area = await this.prisma.area.findUnique({
      where: {
        htmlId: createBookingDto.htmlId,
      },
      include: {
        AreaType: true,
        Location: true,
      },
    });
    if (!area) {
      throw new HttpException(
        'The htmlId does not exist.',
        HttpStatus.BAD_REQUEST
      );
    }

    const hasBookedAnother = await this.hasBookedAnother({
      userId,
      areaType: area.AreaType,
      bookingTime,
    });
    if (hasBookedAnother) {
      throw new HttpException(
        {
          title: `One ${area.AreaType.name} at a time`,
          message: `You have already booked another ${area.AreaType.name} at this time.`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const hasReachedCapacity = await this.hasReachedCapacity({
      capacity: area.Location.capacity,
      location: area.Location,
      bookingTime,
    });
    if (hasReachedCapacity) {
      throw new HttpException(
        {
          title: `Capacity Reached`,
          message: `Unable to book at this location anymore. Capacity limit reached.`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.prisma.$transaction(
      bookingTime.map((booking) =>
        this.prisma.booking.create({
          data: {
            ...booking,
            userId,
            areaId: area.id,
          },
          include: this.include,
        })
      )
    );
  }

  private async hadConflict({
    htmlId,
    bookingTime,
  }: {
    htmlId: string;
    bookingTime: { startTime: Date; endTime: Date }[];
  }) {
    const conflict = await this.prisma.booking.count({
      where: {
        Area: {
          htmlId,
        },
        OR: bookingTime.map((booking) => ({
          startTime: {
            lt: booking.endTime,
          },
          endTime: {
            gt: booking.startTime,
          },
        })),
      },
    });

    return !!conflict;
  }

  private async hasBookedAnother({
    userId,
    areaType,
    bookingTime,
  }: {
    userId: number;
    areaType: AreaType;
    bookingTime: { startTime: Date; endTime: Date }[];
  }) {
    // One person can onl book 1 desk/room at a time
    const hasBookedOther = await this.prisma.booking.count({
      where: {
        userId,
        Area: {
          AreaType: {
            name: areaType.name,
          },
        },
        OR: bookingTime.map((booking) => ({
          startTime: {
            lt: booking.endTime,
          },
          endTime: {
            gt: booking.startTime,
          },
        })),
      },
    });

    return !!hasBookedOther;
  }

  private async hasReachedCapacity({
    capacity,
    bookingTime,
    location,
  }: {
    capacity: number;
    location: Location;
    bookingTime: { startTime: Date; endTime: Date }[];
  }) {
    // how many seats are there
    const numberOfSeats = await this.prisma.area.count({
      where: {
        Location: {
          id: location.id,
        },
      },
    });

    const all = await this.prisma.$transaction(
      bookingTime.map((booking) =>
        this.prisma.booking.groupBy({
          by: ['areaId'],
          where: {
            startTime: {
              gte: dayjs
                .tz(booking.startTime, location.timeZone)
                .startOf('day')
                .toDate(),
            },
            endTime: {
              lt: dayjs
                .tz(booking.startTime, location.timeZone)
                .endOf('day')
                .toDate(),
            },
          },
        })
      )
    );

    return all.every((each) => !(each.length / numberOfSeats < capacity));
  }
}
