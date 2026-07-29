import { Injectable, NotFoundException } from '@nestjs/common';
import { MealsService } from '../meals/meals.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mealsService: MealsService,
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

    return { meals, nutrition };
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
