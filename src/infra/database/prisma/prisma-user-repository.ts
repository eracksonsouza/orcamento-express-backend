import { UserRole as PrismaUserRole, type PrismaClient } from "@prisma/client";
import prismaClient from "@/src/infra/database/prisma/client";
import type { UserRepository } from "@/src/domain/user/application/repositories/user-repository";
import type { User } from "@/src/domain/user/enterprise/entities/user";
import { UserMapper } from "./mappers/user-mapper";

export class PrismaUserRepository implements UserRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? prismaClient;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async save(user: User): Promise<void> {
    const exists = await this.prisma.user.findUnique({
      where: { id: user.id.toString() },
    });

    if (exists) {
      await this.prisma.user.update({
        where: { id: user.id.toString() },
        data: {
          name: user.name,
          email: user.email,
          password_hash: user.passwordHash,
          role: user.role as PrismaUserRole,
        },
      });
    } else {
      await this.prisma.user.create({
        data: UserMapper.toPersistence(user),
      });
    }
  }
}
