import {
  FindAllLocationReturn,
  FindOneLocationReturn,
  UpdateLocationDto,
  UpdateLocationResponse,
} from '@desk-booking/data';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prismaService: PrismaService) {}

  private idOrLocationName(id: string) {
    return /^-?\d+$/.test(id) ? { id: +id } : { name: id };
  }

  async findOne(id: string): Promise<FindOneLocationReturn> {
    return await this.prismaService.location.findUnique({
      where: this.idOrLocationName(id),
    });
  }

  async findAll(): Promise<FindAllLocationReturn> {
    return await this.prismaService.location.findMany({
      orderBy: {
        displayName: 'asc',
      },
    });
  }

  async updateLocation(
    id: number,
    data: UpdateLocationDto
  ): Promise<UpdateLocationResponse> {
    return await this.prismaService.location.update({
      where: { id },
      data,
    });
  }
}
