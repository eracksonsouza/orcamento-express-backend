import { ListQuotesUseCase } from "@/src/domain/quote/application/use-cases/list-quotes";
import { PrismaQuoteRepository } from "@/src/infra/database/prisma/prisma-quote-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeListQuotesUseCase(): ListQuotesUseCase {
  const quoteRepository = new PrismaQuoteRepository(prismaClient);
  return new ListQuotesUseCase(quoteRepository);
}
