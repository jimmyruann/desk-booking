import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Module({
  controllers: [AreasController],
  providers: [AreasService, PrismaService],
})
export class AreasModule {}
