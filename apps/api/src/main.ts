import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Common middleware (such as cookie-parser)
  app.use(cookieParser());

  // 2. Global interceptors (such as performance monitoring, logging, etc.)
  // app.useGlobalInterceptors(new Xxx());

  // 3. Enable CORS
  app.enableCors({
    origin: [process.env.FRONT_END ?? 'http://localhost:3000'],
    credentials: true,
  });

  // 4. Global validator (such as class-validator validation DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );

  // 5. Start the service
  const port = parseInt(process.env.PORT ?? '8080', 10);
  await app.listen(port);
}

bootstrap().then();
