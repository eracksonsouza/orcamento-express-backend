import { GetCurrentUserUseCase } from "@/src/domain/user/application/use-cases/get-current-user";
import { PrismaUserRepository } from "@/src/infra/database/prisma/prisma-user-repository";

export function makeGetCurrentUserUseCase() {
  const userRepository = new PrismaUserRepository();
  return new GetCurrentUserUseCase(userRepository);
}
