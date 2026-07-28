import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NutritionService {
  constructor(private readonly prisma: PrismaService) {}

  getCurrentTarget(userId: string) {
    return this.prisma.nutritionTarget.findFirst({
      where: { userId },
      orderBy: { effectiveFrom: 'desc' },
    });
  }
}
