import {
  CreateAreaDto,
  CreateAreaResponse,
  FindAllAreaResponse,
  FindAreaAvailabilitiesResponse,
  FindOneAreaResponse,
  FindOneAreaWithBookingResponse,
} from '@desk-booking/data';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import RRule, { RRuleSet } from 'rrule';
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

  async create(createAreaDto: CreateAreaDto): Promise<CreateAreaResponse> {
    return await this.prisma.area.create({
      data: createAreaDto,
    });
  }

  async findAllByLocation(locationId: string): Promise<FindAllAreaResponse> {
    return this.prisma.area.findMany({
      where: {
        Location: {
          locationId,
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
    const query = this.idOrHtmlId(id);

    // check exist
    const exist = await this.prisma.area.count({
      where: query,
    });

    if (!exist)
      throw new HttpException(
        `Unable to find Area ${id}`,
        HttpStatus.NOT_FOUND
      );

    return await this.prisma.area.findUnique({
      where: query,
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

  async findAvailabilities(
    id: string,
    date: Date
  ): Promise<FindAreaAvailabilitiesResponse> {
    // get location details
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

    // reusable configs
    const rruleCommonConfig = {
      freq: RRule.SECONDLY,
      interval: area.AreaType.interval / 1000,
    };

    // generate availabilities
    // https://github.com/jakubroztocil/rrule
    const rruleSet = new RRuleSet(true);
    rruleSet.rrule(
      new RRule({
        ...rruleCommonConfig,
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

    const availabilities = generated.map((d) => {
      const curr = {
        startTime: d,
        endTime: dayjs(d).add(rruleCommonConfig.interval, 'second').toDate(),
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

    return {
      availabilities,
      Booking: bookings,
    };
  }

  remove(id: string) {
    // able to use id or htmlId
    const query = /^-?\d+$/.test(id) ? { id: +id } : { htmlId: id };
    return this.prisma.area.delete({
      where: query,
    });
  }
}
