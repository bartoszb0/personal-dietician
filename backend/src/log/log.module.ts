import { Module } from '@nestjs/common';
import { MealsModule } from '../meals/meals.module';
import { LogService } from './log.service';
import { LogController } from './log.controller';

@Module({
  imports: [MealsModule],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
