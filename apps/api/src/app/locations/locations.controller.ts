import {
  CreateLocationDto,
  FindOneStringParams,
  LocationEntity,
  UpdateLocationDto,
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
  ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../../auth/decorator/roles.decorator';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: '[ADMIN] Create new location' })
  @ApiCreatedResponse({ type: LocationEntity })
  async create(@Body() createLocationDto: CreateLocationDto) {
    return new LocationEntity(
      await this.locationsService.create(createLocationDto)
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '[USER, ADMIN] Find one location' })
  @ApiOkResponse({ type: LocationEntity })
  async findOne(@Param() { id }: FindOneStringParams) {
    return new LocationEntity(await this.locationsService.findOne(id));
  }

  @Get()
  @ApiOperation({ summary: '[USER, ADMIN] Find all locations' })
  @ApiOkResponse({ type: [LocationEntity] })
  @ApiQuery({
    name: 'showDisabled',
    type: Boolean,
    required: false,
  })
  async findAll(@Query('showDisabled') showDisabled: boolean) {
    const locations = await this.locationsService.findAll(showDisabled);
    return locations.map((location) => new LocationEntity(location));
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN] Update a location' })
  @ApiCreatedResponse({ type: LocationEntity })
  async update(
    @Param() { id }: FindOneStringParams,
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    return new LocationEntity(
      await this.locationsService.update(id, updateLocationDto)
    );
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: '[ADMIN] Delete a location' })
  @ApiOkResponse({ type: LocationEntity })
  async delete(@Param() { id }: FindOneStringParams) {
    return new LocationEntity(await this.locationsService.delete(id));
  }
}
