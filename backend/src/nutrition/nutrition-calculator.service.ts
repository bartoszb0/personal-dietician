import { Injectable } from '@nestjs/common';
import type { ActivityLevel, Goal, Sex } from '../../generated/prisma/enums';

export type CalculatorInput = {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
};

export type NutritionTargets = {
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
};

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
};

export const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  LOSE: -500,
  MAINTAIN: 0,
  GAIN: 300,
};

/** Never emit a target below this — a hard safety floor. */
export const MIN_CALORIES = 1200;
export const PROTEIN_G_PER_KG = 2.2;
export const FAT_KCAL_RATIO = 0.25;

const KCAL_PER_G = { protein: 4, carb: 4, fat: 9 } as const;

/** Whole years between birthDate and now (accounts for whether the birthday has passed). */
export function ageFromBirthDate(birthDate: Date, now: Date = new Date()): number {
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDelta = now.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/** Mifflin-St Jeor basal metabolic rate. */
export function basalMetabolicRate(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'MALE' ? base + 5 : base - 161;
}

/**
 * Splits a calorie budget into macros: protein anchored at 2.2 g/kg, fat ~25%
 * of calories, carbs fill the remainder. Fat and carbs are clamped so a heavy
 * user on a low budget can never produce a negative macro.
 */
export function computeMacros(
  calories: number,
  weightKg: number,
): Omit<NutritionTargets, 'calories'> {
  const proteinG = Math.round(PROTEIN_G_PER_KG * weightKg);
  const proteinKcal = proteinG * KCAL_PER_G.protein;

  const remainingAfterProtein = Math.max(calories - proteinKcal, 0);
  const fatKcal = Math.min(calories * FAT_KCAL_RATIO, remainingAfterProtein);
  const fatG = Math.round(fatKcal / KCAL_PER_G.fat);

  const carbsKcal = Math.max(calories - proteinKcal - fatG * KCAL_PER_G.fat, 0);
  const carbsG = Math.round(carbsKcal / KCAL_PER_G.carb);

  return { proteinG, fatG, carbsG };
}

@Injectable()
export class NutritionCalculatorService {
  calculate(input: CalculatorInput): NutritionTargets {
    const bmr = basalMetabolicRate(
      input.sex,
      input.weightKg,
      input.heightCm,
      input.age,
    );
    const tdee = bmr * ACTIVITY_MULTIPLIERS[input.activityLevel];
    const calories = Math.max(
      Math.round(tdee + GOAL_ADJUSTMENTS[input.goal]),
      MIN_CALORIES,
    );

    return { calories, ...computeMacros(calories, input.weightKg) };
  }
}
