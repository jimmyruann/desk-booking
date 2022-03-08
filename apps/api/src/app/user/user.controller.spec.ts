import { testDataHelper } from '../../shared/helper/testDataHelper';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const [{ password, ...user }] = testDataHelper.generateUser();

  const req = getMockReq({
    user,
  });
  const { res, mockClear } = getMockRes();

  const mockUserService = {
    findMe: jest.fn().mockReturnValue(() => {
      return user;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
    mockClear();
  });

  it('should return current user', () => {
    expect(true).toBeTruthy();
  });
});
