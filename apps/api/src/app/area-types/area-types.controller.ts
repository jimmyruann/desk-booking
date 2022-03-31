import { AreaTypeEntity } from '@desk-booking/data';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AreaTypesService } from './area-types.service';

@Controller('area-types')
export class AreaTypesController {
  constructor(private readonly areaTypesService: AreaTypesService) {}

  @Get()
  @ApiOperation({ summary: `[USER, ADMIN] Find all areas types` })
  @ApiOkResponse({ type: [AreaTypeEntity] })
  async findAll() {
    const result = await this.areaTypesService.findAll();
    return result.map((each) => new AreaTypeEntity(each));
  }
}
