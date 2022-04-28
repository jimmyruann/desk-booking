import { CreateLocationDto, UpdateLocationDto } from '@desk-booking/data';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prismaService: PrismaService) {}

  private idOrLocationId(id: string) {
    return /^-?\d+$/.test(id) ? { id: +id } : { locationId: id };
  }

  async create(createLocationDto: CreateLocationDto) {
    return await this.prismaService.location.create({
      data: createLocationDto,
    });
  }

  async findOne(id: string) {
    return await this.prismaService.location.findUnique({
      where: this.idOrLocationId(id),
    });
  }

  async findAll() {
    return await this.prismaService.location.findMany({
      orderBy: {
        displayName: 'asc',
      },
    });
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    return await this.prismaService.location.update({
      where: this.idOrLocationId(id),
      data: updateLocationDto,
    });
  }

  async delete(id: string) {
    return await this.prismaService.location.delete({
      where: this.idOrLocationId(id),
    });
  }
}
