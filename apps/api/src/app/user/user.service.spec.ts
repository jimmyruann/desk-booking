import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { HttpException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should find an user', async () => {
    const user = {
      id: 1,
      email: 'fake@email.com',
      username: 'faker',
      password: bcrypt.hashSync('faker_password'),
      firstName: 'Faker',
      lastName: 'Smith',
    };
    prisma.user.findUnique = jest.fn().mockReturnValueOnce(user);
    expect(await service.findOne(1)).toStrictEqual(user);
  });

  it('should return 404 when user not founded', async () => {
    prisma.user.findUnique = jest.fn().mockReturnValueOnce(null);

    try {
      await service.findOne(1);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
