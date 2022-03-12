import { Controller } from '@nestjs/common';
import { AreaTypesService } from './area-types.service';

@Controller('area-types')
export class AreaTypesController {
  constructor(private readonly areaTypesService: AreaTypesService) {}
}
