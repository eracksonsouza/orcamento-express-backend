import { RemoveQuoteItemUseCase } from "@/src/domain/quote/application/use-cases/remove-quote-item";
import { PrismaQuoteRepository } from "@/src/infra/database/prisma/prisma-quote-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeRemoveQuoteItemUseCase(): RemoveQuoteItemUseCase {
  const quoteRepository = new PrismaQuoteRepository(prismaClient);
  return new RemoveQuoteItemUseCase(quoteRepository);
}
