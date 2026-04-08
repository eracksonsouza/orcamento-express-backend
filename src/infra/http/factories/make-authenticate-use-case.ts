import { AuthenticateUseCase } from "@/src/domain/user/application/use-cases/authenticate";
import { PrismaUserRepository } from "@/src/infra/database/prisma/prisma-user-repository";

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUserRepository();
  return new AuthenticateUseCase(userRepository);
}
