import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PreviewTargetDto } from './dto/preview-target.dto';
import {
  ageFromBirthDate,
  NutritionCalculatorService,
  type NutritionTargets,
} from './nutrition-calculator.service';

@Injectable()
export class NutritionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calculator: NutritionCalculatorService,
  ) {}

  // Pure compute — body stats in, targets out. No persistence.
  computeTargets(input: PreviewTargetDto): NutritionTargets {
    return this.calculator.calculate({
      sex: input.sex,
      age: ageFromBirthDate(new Date(input.birthDate)),
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      activityLevel: input.activityLevel,
      goal: input.goal,
    });
  }

  // The active target = the most recent version by effectiveFrom.
  getCurrentTarget(userId: string) {
    return this.prisma.nutritionTarget.findFirst({
      where: { userId },
      orderBy: { effectiveFrom: 'desc' },
    });
  }
}
