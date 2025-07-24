import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import * as Sentry from '@sentry/nestjs';

async function bootstrap() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
  });

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

  // 5. Register a global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 6. Start the service
  const port = parseInt(process.env.PORT || '8080', 10) || 8080;

  // Bind to 0.0.0.0 before being scanned by Render
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
}

bootstrap().then();
