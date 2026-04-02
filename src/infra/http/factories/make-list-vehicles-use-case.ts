import { ListVehiclesUseCase } from "@/src/domain/vehicle/application/use-cases/list-vehicles";
import { PrismaVehicleRepository } from "@/src/infra/database/prisma/prisma-vehicle-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeListVehiclesUseCase(): ListVehiclesUseCase {
  const vehicleRepository = new PrismaVehicleRepository(prismaClient);
  return new ListVehiclesUseCase(vehicleRepository);
}
