import { Injectable, NotFoundException } from '@nestjs/common';
import { MealsService } from '../meals/meals.service';
import { isGoalHit } from '../nutrition/goal-hit';
import { NutritionService } from '../nutrition/nutrition.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mealsService: MealsService,
    private readonly nutritionService: NutritionService,
  ) {}

  async create(createLogDto: CreateLogDto, userId: string) {
    const meal = await this.mealsService.findOne(userId, createLogDto.mealId);
    const servings = createLogDto.servings ?? 1;

    return this.prisma.dailyLogEntry.create({
      data: {
        userId,
        mealId: meal.id,
        name: meal.name,
        servings,
        calories: Math.round(meal.calories * servings),
        proteinG: Math.round(meal.proteinG * servings),
        fatG: Math.round(meal.fatG * servings),
        carbsG: Math.round(meal.carbsG * servings),
        date: new Date(createLogDto.date),
      },
    });
  }

  async getDayLogs(date: string, userId: string) {
    const meals = await this.prisma.dailyLogEntry.findMany({
      where: { userId: userId, date: new Date(date) },
      orderBy: { createdAt: 'asc' },
    });

    const nutrition = meals.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        proteinG: acc.proteinG + e.proteinG,
        fatG: acc.fatG + e.fatG,
        carbsG: acc.carbsG + e.carbsG,
      }),
      { calories: 0, proteinG: 0, fatG: 0, carbsG: 0 },
    );

    const target = await this.nutritionService.getTargetForDate(
      userId,
      new Date(date),
    );
    const hitGoal = target ? isGoalHit(nutrition, target) : false;

    return { meals, nutrition, hitGoal };
  }

  async getCalendar(userId: string, month: string) {
    const [year, mon] = month.split('-').map(Number);
    const from = new Date(Date.UTC(year, mon - 1, 1));
    const to = new Date(Date.UTC(year, mon, 0)); // last day of the month

    const grouped = await this.prisma.dailyLogEntry.groupBy({
      by: ['date'],
      where: { userId, date: { gte: from, lte: to } },
      _sum: { calories: true, proteinG: true },
    });

    const targets = await this.prisma.nutritionTarget.findMany({
      where: { userId, effectiveFrom: { lte: to } },
      orderBy: { effectiveFrom: 'desc' },
    });

    return grouped.map((g) => {
      const dayStr = g.date.toISOString().slice(0, 10);
      const target = targets.find(
        (t) => t.effectiveFrom.toISOString().slice(0, 10) <= dayStr,
      );
      const hit =
        !!target &&
        isGoalHit(
          {
            calories: g._sum.calories ?? 0,
            proteinG: g._sum.proteinG ?? 0,
          },
          target,
        );
      return { date: dayStr, hit };
    });
  }

  async remove(id: string, userId: string) {
    const log = await this.prisma.dailyLogEntry.findFirst({
      where: { id: id, userId: userId },
    });

    if (!log) throw new NotFoundException('Could not find this log');

    return this.prisma.dailyLogEntry.delete({
      where: {
        id: log.id,
        userId: userId,
      },
    });
  }
}
