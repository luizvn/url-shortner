import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const prismaUser = await this.prisma.user.upsert({
      where: { email: user.email },
      update: data,
      create: data,
    });

    return UserMapper.toDomain(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }
}
