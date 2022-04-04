import { NestExpressApplication } from '@nestjs/platform-express';
import session, { SessionOptions } from 'express-session';
import ms from 'ms';
import { v4 as uuid } from 'uuid';
import { environment } from '../environments/environment';
import { RedisService } from '../shared/redis/redis.service';

let redisService: RedisService;

export const initExpressSession = (
  app: NestExpressApplication,
  options?: SessionOptions
) => {
  if (!redisService) redisService = new RedisService();

  const sessionConfig: SessionOptions = {
    name: environment.appSessionName,
    store: redisService.getRedisStore(),
    secret: environment.appSessionSecret,
    saveUninitialized: false,
    resave: false,
    unset: 'destroy',
    genid: () => uuid(),
    proxy: environment.production,
    cookie: {
      maxAge: ms('3d'),
      httpOnly: true,
      secure: environment.production,
    },
  };

  app.use(session(Object.assign(sessionConfig, options)));
};
