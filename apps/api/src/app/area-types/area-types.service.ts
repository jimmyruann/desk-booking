import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class AreaTypesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.areaType.findMany();
  }
}
