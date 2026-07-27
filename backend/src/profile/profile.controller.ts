import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
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

  @Patch()
  updateProfile(@CurrentUser() user: UserPayload, @Body() dto: UpdateProfileDto) {
    return this.profileService.upsertProfile(user.id, dto);
  }
}
