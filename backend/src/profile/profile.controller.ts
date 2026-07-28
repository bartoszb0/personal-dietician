import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentUser() user: UserPayload) {
    return this.profileService.getProfile(user.id);
  }

  @Post()
  createProfile(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(user.id, dto);
  }

  @Patch()
  updateProfile(
    @CurrentUser() user: UserPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.upsertProfile(user.id, dto);
  }
}
