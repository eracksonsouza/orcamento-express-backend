import { CreateVehicleUseCase } from "@/src/domain/vehicle/application/use-cases/create-vehicle";
import { PrismaVehicleRepository } from "@/src/infra/database/prisma/prisma-vehicle-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeCreateVehicleUseCase(): CreateVehicleUseCase {
  const vehicleRepository = new PrismaVehicleRepository(prismaClient);
  return new CreateVehicleUseCase(vehicleRepository);
}
