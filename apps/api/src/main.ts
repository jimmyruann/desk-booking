import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { PrismaClientExceptionFilter } from './shared/prisma/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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

  if (!environment.production) {
    // Swagger
    const swaggerDocumentConfigs = new DocumentBuilder()
      .setTitle('Desk Booking Rest API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(
      app,
      swaggerDocumentConfigs
    );
    SwaggerModule.setup('api', app, swaggerDocument);
  }

  // For express-session
  if (environment.production) app.set('trust proxy', 1);

  // Express middleware
  app.use(helmet());
  app.enableCors({
    credentials: true,
  });
  app.use(cookieParser());

  // Start server
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
