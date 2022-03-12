import { CreateBookingDto, FindAllBookingDto } from '@desk-booking/data';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { User } from '../../auth/decorator/user.decorator';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @User() user: Express.User,
    @Body() createBookingDto: CreateBookingDto
  ) {
    return this.bookingsService.create(+user.id, createBookingDto);
  }

  @Get()
  findAll(@User() user: Express.User, @Query() queries: FindAllBookingDto) {
    return this.bookingsService.findAll(+user.id, queries);
  }

  @Get(':id')
  findOne(@User() user: Express.User, @Param('id') id: string) {
    return this.bookingsService.findOne(+user.id, +id);
  }

  // @Patch(':id')
  // @Roles(UserRole.MANAGER, UserRole.ADMIN)
  // update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
  //   return this.bookingService.update(+id, updateBookingDto);
  // }

  @Delete(':id')
  remove(@User() user: Express.User, @Param('id') id: number) {
    return this.bookingsService.remove(+user.id, +id);
  }
}
