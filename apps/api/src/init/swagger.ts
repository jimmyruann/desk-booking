import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const initSwagger = (app: NestExpressApplication) => {
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
};
