import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ActivityLevel, Goal } from '../../../generated/prisma/enums';

// Only the fields settings can change. sex/birthDate are immutable identity and
// heightCm rarely changes — the whitelist pipe strips anything else.
export class UpdateProfileDto {
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
