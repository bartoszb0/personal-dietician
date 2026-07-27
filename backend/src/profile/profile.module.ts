import { Module } from '@nestjs/common';
import { NutritionModule } from '../nutrition/nutrition.module';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [NutritionModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
