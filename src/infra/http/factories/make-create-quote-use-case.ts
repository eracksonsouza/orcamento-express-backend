import { CreateQuoteUseCase } from "@/src/domain/quote/application/use-cases/create-quote";
import { PrismaQuoteRepository } from "@/src/infra/database/prisma/prisma-quote-repository";
import { PrismaCustomerRepository } from "@/src/infra/database/prisma/prisma-customer-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeCreateQuoteUseCase(): CreateQuoteUseCase {
  const quoteRepository = new PrismaQuoteRepository(prismaClient);
  const customerRepository = new PrismaCustomerRepository(prismaClient);
  return new CreateQuoteUseCase(quoteRepository, customerRepository);
}
