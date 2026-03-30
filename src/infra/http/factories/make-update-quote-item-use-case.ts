import { UpdateQuoteItemUseCase } from "@/src/domain/quote/application/use-cases/update-quote-item";
import { PrismaQuoteRepository } from "@/src/infra/database/prisma/prisma-quote-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeUpdateQuoteItemUseCase(): UpdateQuoteItemUseCase {
  const quoteRepository = new PrismaQuoteRepository(prismaClient);
  return new UpdateQuoteItemUseCase(quoteRepository);
}
