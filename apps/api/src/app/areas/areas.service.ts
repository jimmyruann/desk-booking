import { CreateAreaDto, UpdateAreaDto } from '@desk-booking/data';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Area, AreaType, Location } from '@prisma/client';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { RRule, RRuleSet } from 'rrule';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { isTimeOverlapped } from '../../shared/utils/isTimeOverlapped';
import { roundTime } from '../../shared/utils/roundTime';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  private idOrHtmlId(id: string) {
    return /^-?\d+$/.test(id) ? { id: +id } : { htmlId: id };
  }

  async create(createAreaDto: CreateAreaDto) {
    return await this.prisma.area.create({
      data: createAreaDto,
    });
  }

  async findAll(locationId?: string) {
    const query = {
      Location: {
        locationId,
      },
    };
    return await this.prisma.area.findMany({
      where: locationId ? query : {},
    });
  }

  async findOne(id: string) {
    // able to use id or htmlId
    const query = /^-?\d+$/.test(id) ? { id: +id } : { htmlId: id };

    return await this.prisma.area.findUnique({
      where: query,
      include: {
        AreaType: true,
      },
    });
  }

  // async findOneWithBookings(
  //   id: string,
  //   from: Date,
  //   to: Date
  // ): Promise<FindOneAreaWithBookingResponse> {
  //   const query = this.idOrHtmlId(id);

  //   // check exist
  //   const exist = await this.prisma.area.count({
  //     where: query,
  //   });

  //   if (!exist)
  //     throw new HttpException(
  //       `Unable to find Area ${id}`,
  //       HttpStatus.NOT_FOUND
  //     );

  //   return await this.prisma.area.findUnique({
  //     where: query,
  //     include: {
  //       Booking: {
  //         where: {
  //           startTime: {
  //             gte: from,
  //           },
  //           endTime: {
  //             lte: to,
  //           },
  //         },
  //         include: {
  //           User: {
  //             select: {
  //               firstName: true,
  //               lastName: true,
  //             },
  //           },
  //         },
  //       },
  //       AreaType: true,
  //       Location: true,
  //     },
  //   });
  // }

  private async _findOneArea(id: string) {
    const area = await this.prisma.area.findUnique({
      where: this.idOrHtmlId(id),
      include: {
        Location: true,
        AreaType: true,
      },
    });

    if (!area)
      throw new HttpException(
        `Unable to find Area ${id}`,
        HttpStatus.NOT_FOUND
      );

    return area;
  }

  private _getAllowedTimeFrame(
    date: Date,
    area: Area & {
      Location: Location;
      AreaType: AreaType;
    }
  ) {
    // get the start of day and end of day for input date
    // also convert to selected area HTML Id's timezone
    // we only want to get the availabilities for that html id
    // in its own timezone

    const dateWithTZ = dayjs.tz(date, area.Location.timeZone);

    const allowBookingFrom = dateWithTZ
      .startOf('day')
      .add(area.Location.allowBookingFrom, 'minute')
      .utc()
      .toDate();
    const allowBookingTill = dateWithTZ
      .startOf('day')
      .add(area.Location.allowBookingTill, 'minute')
      .utc()
      .toDate();

    return {
      allowBookingFrom,
      allowBookingTill,
    };
  }

  async findAvailabilities(id: string, date: Date) {
    const area = await this._findOneArea(id);

    const { allowBookingFrom, allowBookingTill } = this._getAllowedTimeFrame(
      date,
      area
    );

    // Check if there are bookings between this time
    const bookings = await this.prisma.booking.findMany({
      where: {
        areaId: area.id,
        startTime: {
          gte: allowBookingFrom,
        },
        endTime: {
          lte: allowBookingTill,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // generate a list of date base on interval
    // https://github.com/jakubroztocil/rrule
    const rruleSet = new RRuleSet(true);

    rruleSet.rrule(
      new RRule({
        freq: RRule.SECONDLY,
        interval: area.AreaType.interval / 1000,
        dtstart: allowBookingFrom,
        until: allowBookingTill,
      })
    );

    const generated = rruleSet.between(
      roundTime(new Date(), area.AreaType.interval, 'up'),
      allowBookingTill,
      true,
      (date) => date < allowBookingTill
    );

    // filter all generated date, remove time which has
    // already booked
    const availabilities = generated.map((d) => {
      const curr = {
        startTime: d,
        endTime: dayjs(d)
          .add(area.AreaType.interval / 1000, 'second')
          .toDate(),
        booked: false,
      };

      if (bookings.length) {
        curr.booked = bookings.some((booking) =>
          isTimeOverlapped(curr, {
            startTime: booking.startTime,
            endTime: booking.endTime,
          })
        );
      }

      return curr;
    });

    return availabilities;
  }

  async findBookings(id: string, date: Date) {
    const area = await this._findOneArea(id);

    const { allowBookingFrom, allowBookingTill } = this._getAllowedTimeFrame(
      date,
      area
    );

    const bookings = await this.prisma.booking.findMany({
      where: {
        areaId: area.id,
        startTime: {
          gte: allowBookingFrom,
        },
        endTime: {
          lte: allowBookingTill,
        },
      },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return bookings;
  }

  async update(id: string, updateAreaDto: UpdateAreaDto) {
    return await this.prisma.area.update({
      where: this.idOrHtmlId(id),
      data: updateAreaDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.area.delete({
      where: this.idOrHtmlId(id),
    });
  }
}
