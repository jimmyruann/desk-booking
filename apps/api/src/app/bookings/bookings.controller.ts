import {
  BookingEntity,
  BookingWithAreaEntity,
  CreateBookingDto,
  FindOneParams,
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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../../auth/decorator/roles.decorator';
import { User } from '../../auth/decorator/user.decorator';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('/user/withArea')
  @ApiOperation({ summary: `[USER] Find User's bookings` })
  @ApiOkResponse({ type: [BookingWithAreaEntity] })
  async findAllWithUserAndArea(
    @User() user: Express.User,
    @Query('startTime') startTime: Date,
    @Query('endTime') endTime: Date
  ) {
    const bookings = await this.bookingsService.findAllWithUserAndArea(
      +user.id,
      startTime,
      endTime
    );
    return bookings.map((booking) => new BookingWithAreaEntity(booking));
  }

  @Post('/user')
  @ApiOperation({ summary: `[USER] Create User's booking` })
  @ApiCreatedResponse({ type: [BookingEntity] })
  async createWithUser(
    @User() user: Express.User,
    @Body() createBookingDto: CreateBookingDto
  ) {
    const bookings = await this.bookingsService.createWithUser(
      +user.id,
      createBookingDto
    );
    return bookings.map((booking) => new BookingEntity(booking));
  }

  @Get('/user')
  @ApiOperation({ summary: `[USER] Find User's bookings` })
  @ApiOkResponse({ type: [BookingEntity] })
  async findAllWithUser(@User() user: Express.User) {
    const bookings = await this.bookingsService.findAllWithUser(+user.id);
    return bookings.map((booking) => new BookingEntity(booking));
  }

  @Get('/user/:id')
  @ApiOperation({ summary: `[USER] Find User's booking` })
  @ApiOkResponse({ type: BookingEntity })
  async findOneWithUser(
    @User() user: Express.User,
    @Param() { id }: FindOneParams
  ) {
    return new BookingEntity(
      await this.bookingsService.findOneWithUser(+user.id, +id)
    );
  }

  @Delete('/user/:id')
  @ApiOperation({ summary: `[USER] Remove User's booking.` })
  @ApiOkResponse({ type: BookingEntity })
  async removeWithUser(
    @User() user: Express.User,
    @Param() { id }: FindOneParams
  ) {
    return new BookingEntity(
      await this.bookingsService.removeWithUser(+user.id, +id)
    );
  }

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: '[ADMIN] Create new booking' })
  @ApiCreatedResponse({
    type: [BookingEntity],
  })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return '';
  }

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: '[ADMIN] Find all bookings' })
  @ApiOkResponse({ type: [BookingEntity] })
  async findAll() {
    const bookings = await this.bookingsService.findAll();
    return bookings.map((booking) => new BookingEntity(booking));
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Find one bookings' })
  @ApiOkResponse({ type: BookingEntity })
  @Get(':id')
  async findOne(@Param() { id }: FindOneParams) {
    return new BookingEntity(await this.bookingsService.findOne(+id));
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Remove one bookings' })
  @ApiOkResponse({ type: BookingEntity })
  remove(@Param('id') id: number) {
    return this.bookingsService.remove(+id);
  }
}
