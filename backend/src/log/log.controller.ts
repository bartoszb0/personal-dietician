import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { CreateLogDto } from './dto/create-log.dto';
import { LogService } from './log.service';

@Controller('log')
@UseGuards(JwtGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  create(@Body() createLogDto: CreateLogDto, @CurrentUser() user: UserPayload) {
    return this.logService.create(createLogDto, user.id);
  }

  @Get('')
  getDayLogs(@Query('date') date: string, @CurrentUser() user: UserPayload) {
    return this.logService.getDayLogs(date, user.id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.logService.findOne(+id);
  // }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.logService.remove(id, user.id);
  }
}
