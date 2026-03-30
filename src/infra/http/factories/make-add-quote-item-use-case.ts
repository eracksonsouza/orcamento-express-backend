import { AddQuoteItemUseCase } from "@/src/domain/quote/application/use-cases/add-quote-item";
import { PrismaQuoteRepository } from "@/src/infra/database/prisma/prisma-quote-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeAddQuoteItemUseCase(): AddQuoteItemUseCase {
  const quoteRepository = new PrismaQuoteRepository(prismaClient);
  return new AddQuoteItemUseCase(quoteRepository);
}
