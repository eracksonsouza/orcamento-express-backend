import { CreateCustomerUseCase } from "@/src/domain/customer/application/use-cases/create-customer";
import { PrismaCustomerRepository } from "@/src/infra/database/prisma/prisma-customer-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeCreateCustomerUseCase(): CreateCustomerUseCase {
  const customerRepository = new PrismaCustomerRepository(prismaClient);
  return new CreateCustomerUseCase(customerRepository);
}
