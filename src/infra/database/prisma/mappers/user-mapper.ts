import { UserRole as PrismaUserRole, type Prisma } from "@prisma/client";
import { User } from "@/src/domain/user/enterprise/entities/user";
import { UserRole } from "@/src/domain/user/enterprise/enums/user-role";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";

type PrismaUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: PrismaUserRole;
  createdAt: Date;
  updatedAt: Date;
};

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        passwordHash: raw.password_hash,
        role: raw.role as UserRole,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPersistence(user: User): Prisma.UserCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password_hash: user.passwordHash,
      role: user.role as PrismaUserRole,
    };
  }
}
