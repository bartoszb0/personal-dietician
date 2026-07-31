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

  // Edit an existing profile (weight/activity/goal). update — not upsert — so a
  // non-onboarded user gets a 404 instead of creating a partial profile.
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.$transaction(async (tx) => {
      const profile = await tx.profile.update({ where: { userId }, data: dto });

      // any body-stat/goal change shifts the targets, so version a fresh
      // NutritionTarget (never overwrite past ones). A profile that exists is
      // always complete, so the remaining fields come from the stored row.
      const targets = this.nutrition.computeTargets({
        sex: profile.sex!,
        birthDate: profile.birthDate!.toISOString(),
        heightCm: profile.heightCm!,
        weightKg: Number(profile.weightKg),
        activityLevel: profile.activityLevel!,
        goal: profile.goal!,
      });

      const nutritionTarget = await tx.nutritionTarget.create({
        data: { userId, ...targets },
      });

      return { profile, nutritionTarget };
    });
  }
}
