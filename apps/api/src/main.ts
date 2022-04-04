import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import fs from 'fs';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { initExpressSession } from './init/session';
import { initSwagger } from './init/swagger';
import { PrismaClientExceptionFilter } from './shared/prisma/prisma-client-exception.filter';

async function bootstrap() {
  // const keyFile = fs.readFileSync(__dirname + '/assets/certs/local-dev.key');
  // const certFile = fs.readFileSync(__dirname + '/assets/certs/local-dev.cert');

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: 'https://localhost:4200',
      credentials: true,
    },
    // httpsOptions: {
    //   key: keyFile,
    //   cert: certFile,
    // },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Input validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    })
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  if (!environment.production) initSwagger(app);

  // Express middleware
  app.use(helmet());
  initExpressSession(app);

  // Start server
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
