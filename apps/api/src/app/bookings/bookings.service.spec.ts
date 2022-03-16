import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import dayjs from 'dayjs';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { BookingsService } from './bookings.service';

describe('BookingService', () => {
  let service: BookingsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService, PrismaService],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create()', () => {
    it('should create a new booking', async () => {
      const d = new Date('2022-02-25T00:00:00.000Z');
      const newB = {
        id: 35,
        htmlId: 'test-1',
        locationId: 1,
        entityTypeId: 2,
        Booking: [
          {
            id: 7,
            entityId: 35,
            userId: 1,
            startTime: dayjs(d).add(1, 'hour').toDate(),
            endTime: dayjs(d).add(2, 'hour').toDate(),
          },
        ],
        Location: { id: 1, name: 'singapore' },
      };
      prisma.booking.count = jest.fn().mockReturnValueOnce(0);
      prisma.area.update = jest.fn().mockReturnValueOnce(newB);

      expect(
        await service.create(1, {
          htmlId: 'test-1',
          bookings: [
            {
              startTime: dayjs(d).add(1, 'hour').toDate(),
              endTime: dayjs(d).add(2, 'hour').toDate(),
            },
          ],
        })
      ).toMatchObject(newB);
    });

    it('should not create a new booking', async () => {
      prisma.booking.count = jest.fn().mockReturnValueOnce(1);

      try {
        await service.create(1, {
          htmlId: 'test-1',
          bookings: [
            {
              startTime: dayjs().add(1, 'hour').toDate(),
              endTime: dayjs().add(2, 'hour').toDate(),
            },
            {
              startTime: dayjs().add(3, 'hour').toDate(),
              endTime: dayjs().add(4, 'hour').toDate(),
            },
          ],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });
});
