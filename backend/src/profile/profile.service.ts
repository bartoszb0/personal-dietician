import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  async getMe(userId: string) {
    return this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });
  }
}
