import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { PreviewTargetDto } from './dto/preview-target.dto';
import { NutritionService } from './nutrition.service';

@Controller('nutrition')
@UseGuards(JwtGuard)
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Get('target')
  getCurrentTarget(@CurrentUser() user: UserPayload) {
    return this.nutritionService.getCurrentTarget(user.id);
  }

  @Post('preview')
  previewTarget(@Body() dto: PreviewTargetDto) {
    return this.nutritionService.computeTargets(dto);
  }
}
