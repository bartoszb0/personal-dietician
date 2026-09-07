import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Throttle, seconds } from '@nestjs/throttler';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      access_token: result.access_token,
      email: result.email,
      id: result.id,
      isOnboarded: result.isOnboarded,
    };
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      access_token: result.access_token,
      email: result.email,
      id: result.id,
      isOnboarded: result.isOnboarded,
    };
  }

  // With Bearer tokens logout is client-side (the client drops the token);
  // the route stays so the existing frontend contract keeps working.
  @Post('logout')
  logout() {
    return { message: 'Logged out' };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  me(@CurrentUser() user: UserPayload) {
    return this.authService.getMe(user.email, user.id);
  }
}
