import { DeleteVehicleUseCase } from "@/src/domain/vehicle/application/use-cases/delete-vehicle";
import { PrismaVehicleRepository } from "@/src/infra/database/prisma/prisma-vehicle-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeDeleteVehicleUseCase(): DeleteVehicleUseCase {
  const vehicleRepository = new PrismaVehicleRepository(prismaClient);
  return new DeleteVehicleUseCase(vehicleRepository);
}
