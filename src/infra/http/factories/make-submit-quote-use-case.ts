import { SubmitQuoteUseCase } from "@/src/domain/quote/application/use-cases/submit-quote";
import { PrismaQuoteRepository } from "@/src/infra/database/prisma/prisma-quote-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeSubmitQuoteUseCase(): SubmitQuoteUseCase {
  const quoteRepository = new PrismaQuoteRepository(prismaClient);
  return new SubmitQuoteUseCase(quoteRepository);
}
