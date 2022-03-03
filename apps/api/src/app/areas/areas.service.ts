import {
  CreateAreaDto,
  CreateAreaReturn,
  FindAllLocationReturn,
  FindOneReturn,
} from '@desk-booking/data';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}
  async create(createAreaDto: CreateAreaDto): Promise<CreateAreaReturn> {
    return await this.prisma.area.create({
      data: createAreaDto,
    });
  }
  async findAllByLocation(location: string): Promise<FindAllLocationReturn> {
    return this.prisma.area.findMany({
      where: {
        Location: {
          name: location,
        },
      },
    });
  }

  async findOne(id: string): Promise<FindOneReturn> {
    // able to use id or htmlId
    const query = /^-?\d+$/.test(id) ? { id: +id } : { htmlId: id };

    return await this.prisma.area.findUnique({
      where: query,
      include: {
        AreaType: true,
      },
    });
  }

  remove(id: string) {
    // able to use id or htmlId
    const query = /^-?\d+$/.test(id) ? { id: +id } : { htmlId: id };
    return this.prisma.area.delete({
      where: query,
    });
  }
}