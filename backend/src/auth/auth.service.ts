import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: RegisterDto) {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
      },
    });

    return {
      access_token: await this.generateToken(user.id, user.email),
      id: user.id,
      email: user.email,
      isOnboarded: false,
    };
  }

  async login(body: LoginDto) {
    const match = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!match) throw new UnauthorizedException('Invalid credentials');

    const compareResult = await bcrypt.compare(body.password, match.password);

    if (!compareResult) throw new UnauthorizedException('Invalid credentials');

    const profile = await this.prisma.profile.findUnique({
      where: { userId: match.id },
      select: { onboardingCompletedAt: true },
    });

    return {
      access_token: await this.generateToken(match.id, match.email),
      id: match.id,
      email: match.email,
      isOnboarded: profile?.onboardingCompletedAt != null,
    };
  }

  async getMe(userEmail: string, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    return {
      email: userEmail,
      id: userId,
      isOnboarded: profile?.onboardingCompletedAt != null,
    };
  }

  private async generateToken(userId: string, email: string) {
    return this.jwtService.signAsync({ sub: userId, email });
  }
}
