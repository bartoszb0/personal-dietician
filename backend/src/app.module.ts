import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: seconds(60), limit: 100 }]),
    PrismaModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
