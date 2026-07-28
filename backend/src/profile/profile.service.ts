import { Injectable } from '@nestjs/common';
import { NutritionService } from '../nutrition/nutrition.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nutrition: NutritionService,
  ) {}

  async getProfile(userId: string) {
    return this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });
  }

  async createProfile(userId: string, dto: CreateProfileDto) {
    const targets = this.nutrition.computeTargets(dto);

    return this.prisma.$transaction(async (tx) => {
      const profile = await tx.profile.create({
        data: {
          userId,
          sex: dto.sex,
          birthDate: new Date(dto.birthDate),
          heightCm: dto.heightCm,
          weightKg: dto.weightKg,
          activityLevel: dto.activityLevel,
          goal: dto.goal,
          onboardingCompletedAt: new Date(),
        },
      });

      const nutritionTarget = await tx.nutritionTarget.create({
        data: { userId, ...targets },
      });

      return { profile, nutritionTarget };
    });
  }

  async upsertProfile(userId: string, dto: UpdateProfileDto) {
    const data = {
      ...dto,
      ...(dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
    };

    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
}
