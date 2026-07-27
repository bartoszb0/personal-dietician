import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { ActivityLevel, Goal, Sex } from '../../../generated/prisma/enums';

export class CreateProfileDto {
  @IsEnum(Sex)
  declare sex: Sex;

  @IsDateString()
  declare birthDate: string;

  @IsInt()
  @Min(100)
  @Max(250)
  declare heightCm: number;

  @IsNumber()
  @Min(30)
  @Max(300)
  declare weightKg: number;

  @IsEnum(ActivityLevel)
  declare activityLevel: ActivityLevel;

  @IsEnum(Goal)
  declare goal: Goal;
}
