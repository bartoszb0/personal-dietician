import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { Throttle, seconds } from '@nestjs/throttler';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { AUTH_COOKIE_NAME, getCookieOptions } from './auth.constants';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(registerDto);
    res.cookie(AUTH_COOKIE_NAME, result.access_token, getCookieOptions());
    return { email: result.email, id: result.id };
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    res.cookie(AUTH_COOKIE_NAME, result.access_token, getCookieOptions());
    return { email: result.email, id: result.id };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, getCookieOptions());
    return { message: 'Logged out' };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  me(@CurrentUser() user: UserPayload) {
    return { email: user.email, id: user.id };
  }
}
