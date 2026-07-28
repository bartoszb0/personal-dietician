import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { FindMealsDto, MealSort } from './dto/find-meals.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

const ORDER_BY = {
  [MealSort.RECENT]: { createdAt: 'desc' },
  [MealSort.CALORIES]: { calories: 'desc' },
  [MealSort.PROTEIN]: { proteinG: 'desc' },
  [MealSort.NAME]: { name: 'asc' },
} as const;

@Injectable()
export class MealsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateMealDto) {
    return this.prisma.meal.create({ data: { userId, ...dto } });
  }

  async findAll(userId: string, query: FindMealsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = {
      userId,
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.meal.findMany({
        where,
        orderBy: ORDER_BY[query.sort ?? MealSort.RECENT],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.meal.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(userId: string, id: string) {
    const meal = await this.prisma.meal.findFirst({ where: { id, userId } });
    if (!meal) throw new NotFoundException('Meal not found');
    return meal;
  }

  async update(userId: string, id: string, dto: UpdateMealDto) {
    await this.findOne(userId, id);
    return this.prisma.meal.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.meal.delete({ where: { id } });
    return { id };
  }
}
