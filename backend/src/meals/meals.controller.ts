import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealsService } from './meals.service';

@Controller('meals')
@UseGuards(JwtGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  create(@CurrentUser() user: UserPayload, @Body() dto: CreateMealDto) {
    return this.mealsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.mealsService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.mealsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMealDto,
  ) {
    return this.mealsService.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.mealsService.remove(user.id, id);
  }
}
