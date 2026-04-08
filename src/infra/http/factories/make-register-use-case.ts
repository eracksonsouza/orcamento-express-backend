import { RegisterUseCase } from "@/src/domain/user/application/use-cases/register";
import { PrismaUserRepository } from "@/src/infra/database/prisma/prisma-user-repository";

export function makeRegisterUseCase() {
  const userRepository = new PrismaUserRepository();
  return new RegisterUseCase(userRepository);
}
