import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
