import { Injectable } from '@nestjs/common';
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

  getDayLogs(date: string, userId: string) {
    return this.prisma.dailyLogEntry.findMany({
      where: { userId: userId, date: new Date(date) },
      orderBy: { createdAt: 'asc' },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} log`;
  // }

  // update(id: number, updateLogDto: UpdateLogDto) {
  //   return `This action updates a #${id} log`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} log`;
  // }
}
