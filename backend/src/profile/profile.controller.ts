import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  getMe(@CurrentUser() user: UserPayload) {
    return this.profileService.getMe(user.id);
  }
}
