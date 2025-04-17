import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.FRONT_END ?? 'http://localhost:3000'],
    // origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // Exclude fields that are not in the DTO
      // forbidNonWhitelisted: true, // If you find extra fields, you will report an error directly
    }),
  ); // All DTOs will be automatically verified, and non-compliant requests will return 400 Bad Request
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap().then();
