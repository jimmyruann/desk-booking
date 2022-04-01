import { Injectable, Logger } from '@nestjs/common';
import RedisStore from 'connect-redis';
import session from 'express-session';
import redis, { RedisClient } from 'redis';
import { environment } from '../../environments/environment';

@Injectable()
export class RedisService {
  private redisUrl = environment.redisUrl;
  private redisClient: RedisClient;

  getRedisClient() {
    if (!this.redisClient) {
      this.redisClient = redis.createClient({
        url: this.redisUrl,
      });

      this.redisClient
        .on('ready', () => Logger.log('Redis Server is ready.'))
        .on('error', () => {
          Logger.log(
            `Can not connect to Redis server. Redis URL: ${this.redisUrl}`
          );
          process.exit(0);
        });
    }
    return this.redisClient;
  }

  getRedisStore() {
    return new (RedisStore(session))({
      client: this.getRedisClient(),
    });
  }
}

// app.use(
//   session({
//     store: RedisStore()
//     secret: environment.appSessionSecret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: ms('1d'),
//       secure: environment.production,
//     },
//   })
// );
