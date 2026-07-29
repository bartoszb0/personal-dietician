import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateLogDto {
  @IsUUID()
  declare mealId: string;

  @IsDateString()
  declare date: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(50)
  declare servings?: number;
}
