import { CreateNewQuoteVersionUseCase } from "@/src/domain/quote/application/use-cases/create-new-quote-version";
import { PrismaQuoteRepository } from "@/src/infra/database/prisma/prisma-quote-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeCreateNewQuoteVersionUseCase(): CreateNewQuoteVersionUseCase {
  const quoteRepository = new PrismaQuoteRepository(prismaClient);
  return new CreateNewQuoteVersionUseCase(quoteRepository);
}
