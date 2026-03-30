import { AssignVehicleToQuoteUseCase } from "@/src/domain/quote/application/use-cases/assign-vehicle-to-quote";
import { PrismaQuoteRepository } from "@/src/infra/database/prisma/prisma-quote-repository";
import { PrismaVehicleRepository } from "@/src/infra/database/prisma/prisma-vehicle-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeAssignVehicleToQuoteUseCase(): AssignVehicleToQuoteUseCase {
  const quoteRepository = new PrismaQuoteRepository(prismaClient);
  const vehicleRepository = new PrismaVehicleRepository(prismaClient);
  return new AssignVehicleToQuoteUseCase(quoteRepository, vehicleRepository);
}
