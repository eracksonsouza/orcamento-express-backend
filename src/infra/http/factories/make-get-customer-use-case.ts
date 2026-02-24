import { GetCustomerUseCase } from "@/src/domain/customer/application/use-cases/get-customer";
import { PrismaCustomerRepository } from "@/src/infra/database/prisma/prisma-customer-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeGetCustomerUseCase(): GetCustomerUseCase {
  const customerRepository = new PrismaCustomerRepository(prismaClient);
  return new GetCustomerUseCase(customerRepository);
}
