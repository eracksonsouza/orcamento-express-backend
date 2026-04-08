import { UpdateCustomerUseCase } from "@/src/domain/customer/application/use-cases/update-customer";
import { PrismaCustomerRepository } from "@/src/infra/database/prisma/prisma-customer-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeUpdateCustomerUseCase(): UpdateCustomerUseCase {
  const customerRepository = new PrismaCustomerRepository(prismaClient);
  return new UpdateCustomerUseCase(customerRepository);
}
