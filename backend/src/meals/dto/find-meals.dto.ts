import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum MealSort {
  RECENT = 'recent',
  CALORIES = 'calories',
  PROTEIN = 'protein',
  NAME = 'name',
}

export class FindMealsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(MealSort)
  sort?: MealSort;

  // Query params arrive as strings — @Type coerces to number.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
