import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public/' });

  app.enableCors({
    origin: 'http://localhost:3002',  // Adjust the port to match your frontend application
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  const config = new DocumentBuilder()
    .setTitle('True North VHS API')
    .setDescription('True North VHS API Overview')
    .setVersion('1.0')
    .addTag('vhs', 'rental')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
