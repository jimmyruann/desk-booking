import { Controller, Get, Param } from '@nestjs/common';
import { UserRole } from '@prisma/client';
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
}
