import { GetQuoteUseCase } from "@/src/domain/quote/application/use-cases/get-quote";
import { PrismaQuoteRepository } from "@/src/infra/database/prisma/prisma-quote-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeGetQuoteUseCase(): GetQuoteUseCase {
  const quoteRepository = new PrismaQuoteRepository(prismaClient);
  return new GetQuoteUseCase(quoteRepository);
}
