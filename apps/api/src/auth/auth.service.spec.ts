import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { testDataHelper } from '../shared/helper/testDataHelper';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('validateUser()', () => {
    it("should reject if user doesn't exist when try to login", async () => {
      prisma.user.findUnique = jest.fn().mockReturnValueOnce(null);
      expect(
        await service.validateUser('admin@faker.com', 'fakerPassword')
      ).toBeNull();
    });

    it('should approve/reject login user', async () => {
      const [user, userPassword] = testDataHelper.generateUser();
      prisma.user.findUnique = jest.fn().mockReturnValue(user);

      expect(await service.validateUser(user.email, 'fake')).toBeNull();
      expect(await service.validateUser(user.email, userPassword)).toBe(user);
    });
  });

  describe('generateAccessToken() & generateRefreshToken()', () => {
    it('should generate a new access token', () => {
      const [{ password, ...user }] = testDataHelper.generateUser();
      expect(service.generateAccessToken(user).access_token).toBeTruthy();
    });

    it('should generate a new access token from refresh', () => {
      const [{ password, ...user }] = testDataHelper.generateUser();
      expect(service.generateRefreshToken(user).refresh_token).toBeTruthy();
    });
  });
});
