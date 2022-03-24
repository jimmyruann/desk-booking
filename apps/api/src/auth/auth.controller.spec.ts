import { getMockReq, getMockRes } from '@jest-mock/express';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { COOKIE_CONSTANT } from '../constants/cookie';
import { testDataHelper } from '../shared/helper/testDataHelper';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard';

describe('AuthController', () => {
  let controller: AuthController;

  const [{ password, ...user }] = testDataHelper.generateUser();

  const req = getMockReq({
    user,
  });
  const { res, mockClear } = getMockRes();

  const mockAuthService = {
    generateAccessToken: jest.fn().mockImplementation(() => {
      return { access_token: 'GENERATED_ACCESS_JWT' };
    }),
    generateRefreshToken: jest.fn().mockImplementation(() => {
      return { refresh_token: 'GENERATED_REFRESH_JWT' };
    }),
    removeRefreshToken: jest.fn().mockImplementation(() => {
      return true;
    }),
  };

  const mockJwtService = {
    verifyAsync: jest.fn().mockImplementation(async () => {
      return req.user;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      //   imports: [JwtModule.register({})],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: LocalAuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: RefreshJwtAuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
    mockClear();
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it('should login', () => {
    controller.login(req.user, res);

    // set refresh token in cookie
    expect(res.cookie).toHaveBeenCalledWith(
      COOKIE_CONSTANT.refresh.name,
      'GENERATED_REFRESH_JWT',
      COOKIE_CONSTANT.refresh.options
    );

    // return access_token and user
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: req.user,
        access_token: 'GENERATED_ACCESS_JWT',
      })
    );
  });

  it('should refresh access token', () => {
    expect(controller.refresh(req.user)).toEqual({
      access_token: 'GENERATED_ACCESS_JWT',
      user: req.user,
    });
  });

  it('should logout - without refresh cookie', async () => {
    await controller.logout(req, res);

    // remove cookie
    expect(res.clearCookie).toBeCalledWith(COOKIE_CONSTANT.refresh.name, {
      maxAge: 0,
    });

    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        message: 'You have logged out.',
      })
    );
  });

  it('should logout - with refresh cookie', async () => {
    req.cookies[COOKIE_CONSTANT.refresh.name] = 'GENERATED_REFRESH_JWT';

    await controller.logout(req, res);

    // remove cookie
    expect(res.clearCookie).toBeCalledWith(COOKIE_CONSTANT.refresh.name, {
      maxAge: 0,
    });

    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        message: 'You have logged out.',
      })
    );
  });
});
