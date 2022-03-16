import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';

@Module({
  controllers: [AreasController],
  providers: [AreasService, PrismaService],
})
export class AreasModule {}
