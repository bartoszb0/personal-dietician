import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMealDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  declare name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  declare ingredients?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  declare recipe?: string;

  @IsInt()
  @Min(0)
  declare calories: number;

  @IsInt()
  @Min(0)
  declare proteinG: number;

  @IsInt()
  @Min(0)
  declare fatG: number;

  @IsInt()
  @Min(0)
  declare carbsG: number;
}
