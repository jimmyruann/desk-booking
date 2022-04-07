import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { initExpressSession, initMiddleWares, initSwagger } from './init';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      credentials: true,
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  if (!environment.production) initSwagger(app);

  // Express middleware
  initMiddleWares(app);
  initExpressSession(app);

  // Start server
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
