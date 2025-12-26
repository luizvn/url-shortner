import { Prisma, User as PrismaUser } from '@prisma/client';
import { Role, AuthProvider, Status } from '@url-shortner/auth-contract';
import { User } from '../../../domain/entities/user';

export class UserMapper {
  private constructor() {
    throw new Error('UserMapper cannot be instantiated');
  }

  public static toDomain(prismaUser: PrismaUser): User {
    return User.create({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      name: prismaUser.name,
      role: prismaUser.role as Role,
      status: prismaUser.status as Status,
      authProvider: prismaUser.authProvider as AuthProvider,
      googleId: prismaUser.googleId,
    });
  }

  public static toPersistence(user: User): Prisma.UserCreateInput {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role,
      status: user.status,
      authProvider: user.authProvider,
      googleId: user.googleId,
    };
  }
}
