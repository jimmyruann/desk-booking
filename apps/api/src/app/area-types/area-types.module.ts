import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { AreaTypesController } from './area-types.controller';
import { AreaTypesService } from './area-types.service';

@Module({
  controllers: [AreaTypesController],
  providers: [AreaTypesService, PrismaService],
})
export class AreaTypesModule {}
