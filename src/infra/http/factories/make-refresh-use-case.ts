import { PrismaUserRepository } from "@/src/infra/database/prisma/prisma-user-repository";

export function makeRefreshUseCase() {
  return new PrismaUserRepository();
}
