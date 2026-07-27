import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { ActivityLevel, Goal, Sex } from '../../../generated/prisma/enums';

export class UpdateProfileDto {
  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(250)
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  weightKg?: number;

  @IsOptional()
  @IsEnum(ActivityLevel)
  activityLevel?: ActivityLevel;

  @IsOptional()
  @IsEnum(Goal)
  goal?: Goal;
}
