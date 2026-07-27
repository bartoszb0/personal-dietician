import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });
  }

  async upsertProfile(userId: string, dto: UpdateProfileDto) {
    const data = {
      ...dto,
      ...(dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
    };

    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
}
