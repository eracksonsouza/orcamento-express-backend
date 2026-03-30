import { UpdateQuoteCommercialTermsUseCase } from "@/src/domain/quote/application/use-cases/update-quote-commercial-terms";
import { PrismaQuoteRepository } from "@/src/infra/database/prisma/prisma-quote-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeUpdateQuoteCommercialTermsUseCase(): UpdateQuoteCommercialTermsUseCase {
  const quoteRepository = new PrismaQuoteRepository(prismaClient);
  return new UpdateQuoteCommercialTermsUseCase(quoteRepository);
}
