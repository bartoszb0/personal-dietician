import { IsInt, Min } from 'class-validator';

// Manual target override (isCustom). Not used yet — reserved for the
// "edit my targets" feature in settings.
export class CreateNutritionDto {
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
