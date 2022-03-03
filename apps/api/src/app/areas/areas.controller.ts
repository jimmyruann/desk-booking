import { CreateAreaDto } from '@desk-booking/data';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../auth/decorator/roles.decorator';
import { AreasService } from './areas.service';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  findAll(@Query('location') location: string) {
    return this.areasService.findAllByLocation(location);
  }

  @Get(':idOrHtmlId')
  findOne(@Param('idOrHtmlId') idOrHtmlId: string) {
    return this.areasService.findOne(idOrHtmlId);
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':idOrHtmlId')
  remove(@Param('idOrHtmlId') idOrHtmlId: string) {
    return this.areasService.remove(idOrHtmlId);
  }
}
