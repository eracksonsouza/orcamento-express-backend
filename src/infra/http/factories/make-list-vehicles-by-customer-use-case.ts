import { ListVehiclesByCustomerUseCase } from "@/src/domain/vehicle/application/use-cases/list-vehicles-by-customer";
import { PrismaVehicleRepository } from "@/src/infra/database/prisma/prisma-vehicle-repository";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeListVehiclesByCustomerUseCase(): ListVehiclesByCustomerUseCase {
  const vehicleRepository = new PrismaVehicleRepository(prismaClient);
  return new ListVehiclesByCustomerUseCase(vehicleRepository);
}
