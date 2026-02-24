import { ListCustomersUseCase } from "@/src/domain/customer/application/use-cases/list-customers";
import { PrismaCustomerRepository } from "@/src/infra/database/prisma/prisma-customer-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeListCustomersUseCase(): ListCustomersUseCase {
  const customerRepository = new PrismaCustomerRepository(prismaClient);
  return new ListCustomersUseCase(customerRepository);
}
