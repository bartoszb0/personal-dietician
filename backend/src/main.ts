import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL ?? 'http://localhost:5173',
      // allow the Vite dev server over the LAN (phone testing)
      /^http:\/\/192\.168\.\d+\.\d+:5173$/,
      // allow ngrok tunnels (HTTPS) for mobile testing with the camera
      /^https:\/\/[a-z0-9-]+\.ngrok-free\.dev$/,
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
