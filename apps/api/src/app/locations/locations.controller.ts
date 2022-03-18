import { UpdateLocationDto } from '@desk-booking/data';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../auth/decorator/roles.decorator';
import { User } from '../../auth/decorator/user.decorator';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Get()
  findAll(@User() user: Express.User) {
    return this.locationsService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  updateLocation(@Param('id') id: string, @Body() data: UpdateLocationDto) {
    return this.locationsService.updateLocation(+id, data);
  }
}
