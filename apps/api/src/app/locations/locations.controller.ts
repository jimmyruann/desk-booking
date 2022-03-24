import {
  CreateLocationDto,
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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
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
  async findOne(@Param('id') id: string) {
    return new LocationEntity(await this.locationsService.findOne(id));
  }

  @Get()
  @ApiOperation({ summary: '[USER, ADMIN] Find all locations' })
  @ApiOkResponse({ type: [LocationEntity] })
  async findAll() {
    const locations = await this.locationsService.findAll();
    return locations.map((location) => new LocationEntity(location));
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN] Update a location' })
  @ApiCreatedResponse({ type: LocationEntity })
  async update(
    @Param('id') id: string,
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
  async delete(@Param('id') id: string) {
    return new LocationEntity(await this.locationsService.delete(id));
  }
}
