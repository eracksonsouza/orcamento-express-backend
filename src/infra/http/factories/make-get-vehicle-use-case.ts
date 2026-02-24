import { GetVehicleUseCase } from "@/src/domain/vehicle/application/use-cases/get-vehicle";
import { PrismaVehicleRepository } from "@/src/infra/database/prisma/prisma-vehicle-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeGetVehicleUseCase(): GetVehicleUseCase {
  const vehicleRepository = new PrismaVehicleRepository(prismaClient);
  return new GetVehicleUseCase(vehicleRepository);
}
