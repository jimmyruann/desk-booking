import {
  CreateBookingDto,
  FindAllBookingsQuery,
  FindAllBookingsResponse,
  FindOneBookingResponse,
} from '@desk-booking/data';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IsAdmin } from '../../auth/decorator/roles.decorator';
import { User } from '../../auth/decorator/user.decorator';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: `Find all bookings` })
  findAllBookings(
    @User('id') userId: number,
    @IsAdmin() isAdmin: boolean,
    @Query()
    query: FindAllBookingsQuery
  ): Promise<FindAllBookingsResponse> {
    return this.bookingsService.findAll(
      isAdmin
        ? query
        : {
            ...query,
            userId,
          }
    );
  }

  @Get(':id')
  @ApiOperation({ summary: `Find one bookings` })
  findOneBooking(
    @User('id') userId: number,
    @IsAdmin() isAdmin: boolean,
    @Param('id') id: string
  ): Promise<FindOneBookingResponse> {
    return this.bookingsService.findOne({
      id: +id,
      userId: !isAdmin ? userId : undefined,
    });
  }

  @Post()
  @ApiOperation({ summary: `Create one bookings` })
  createOneBooking(
    @User('id') userId: number,
    @Body() createBookingDto: CreateBookingDto
  ): Promise<FindOneBookingResponse[]> {
    return this.bookingsService.createOne(userId, createBookingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: `Delete one bookings` })
  deleteOneBooking(
    @User('id') userId: number,
    @IsAdmin() isAdmin: boolean,
    @Param('id') id: string
  ): Promise<FindOneBookingResponse> {
    return this.bookingsService.removeOne({
      id: +id,
      userId: !isAdmin ? userId : undefined,
    });
  }
}
