import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findAll(take: number, skip: number) {
    return this.prisma.user.findMany({
      take,
      skip,
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user)
      throw new HttpException('User was not founded.', HttpStatus.NOT_FOUND);

    return user;
  }
}
