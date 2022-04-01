import {
  AreaAvailabilityEntity,
  AreaBookingsEntity,
  AreaEntity,
  CreateAreaDto,
  FindOneStringParams,
  UpdateAreaDto,
} from '@desk-booking/data';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { AreasService } from './areas.service';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  @ApiOperation({ summary: `[USER, ADMIN] Find all areas` })
  @ApiOkResponse({ type: [AreaEntity] })
  async findAll(@Query('locationId') locationId?: string) {
    const areas = await this.areasService.findAll(locationId);
    return areas.map((area) => new AreaEntity(area));
  }

  @Get(':id')
  @ApiOperation({ summary: `[USER, ADMIN] Find one area` })
  @ApiOkResponse({ type: AreaEntity })
  async findOne(@Param() { id }: FindOneStringParams) {
    return new AreaEntity(await this.areasService.findOne(id));
  }

  @Get(':id/availabilities')
  @ApiOperation({ summary: `Find all availabilities for an area` })
  @ApiOkResponse({
    type: [AreaAvailabilityEntity],
  })
  async findAvailabilities(
    @Param() { id }: FindOneStringParams,
    @Query('date') date: Date
  ) {
    const availabilities = await this.areasService.findAvailabilities(id, date);
    return availabilities.map(
      (availability) => new AreaAvailabilityEntity(availability)
    );
  }

  @Get(':id/bookings')
  @ApiOperation({ summary: `Find all bookings for an area` })
  @ApiOkResponse({
    type: [AreaBookingsEntity],
  })
  async findBookings(
    @Param() { id }: FindOneStringParams,
    @Query('date') date: Date
  ) {
    // Keep everything in UTC to be simple
    const bookings = await this.areasService.findBookings(id, date);
    return bookings.map((booking) => new AreaBookingsEntity(booking));
  }

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: `[ADMIN] Create a new area on Map` })
  @ApiCreatedResponse({ type: AreaEntity })
  async create(@Body() createAreaDto: CreateAreaDto) {
    return new AreaEntity(await this.areasService.create(createAreaDto));
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: `[ADMIN] Update an area` })
  @ApiCreatedResponse({ type: AreaEntity })
  async update(
    @Param() { id }: FindOneStringParams,
    @Body() updateAreaDto: UpdateAreaDto
  ) {
    return new AreaEntity(await this.areasService.update(id, updateAreaDto));
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: `[ADMIN] Remove an area` })
  @ApiOkResponse({ type: AreaEntity })
  async remove(@Param() { id }: FindOneStringParams) {
    return new AreaEntity(await this.areasService.remove(id));
  }
}
