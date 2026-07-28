import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@Injectable()
export class MealsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateMealDto) {
    return this.prisma.meal.create({ data: { userId, ...dto } });
  }

  findAll(userId: string) {
    return this.prisma.meal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
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
