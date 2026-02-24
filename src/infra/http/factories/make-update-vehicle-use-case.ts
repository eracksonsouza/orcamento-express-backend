import { UpdateVehicleUseCase } from "@/src/domain/vehicle/application/use-cases/update-vehicle";
import { PrismaVehicleRepository } from "@/src/infra/database/prisma/prisma-vehicle-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeUpdateVehicleUseCase(): UpdateVehicleUseCase {
  const vehicleRepository = new PrismaVehicleRepository(prismaClient);
  return new UpdateVehicleUseCase(vehicleRepository);
}
