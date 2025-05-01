import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Olx example')
    .setDescription('The Olx API description')
    .setVersion('1.0')
    .addTag('Olx')
    .addSecurityRequirements('bearer', ['bearer'])
    .addBearerAuth()

    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.use('/images', express.static(path.join(__dirname, '..', 'images')));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
