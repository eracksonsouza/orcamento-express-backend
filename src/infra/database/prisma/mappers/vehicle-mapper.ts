import { Vehicle } from "@/src/domain/vehicle/enterprise/entities/vehicle";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import type { Vehicle as PrismaVehicle, Prisma } from "@prisma/client";
import type { VehicleType } from "@/src/domain/vehicle/enterprise/enums/vehicle-type";

export class PrismaVehicleMapper {
  static toDomain(raw: PrismaVehicle): Vehicle {
    return Vehicle.create(
      {
        customerId: raw.customerId,
        brand: raw.brand,
        model: raw.model,
        year: raw.year,
        licensePlate: raw.licensePlate,
        type: raw.type as VehicleType,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPersistence(vehicle: Vehicle): Prisma.VehicleCreateInput {
    return {
      id: vehicle.id.toString(),
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate.value,
      type: vehicle.type,
      customer: { connect: { id: vehicle.customerId } },
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    };
  }

  static toUpdatePersistence(vehicle: Vehicle): Prisma.VehicleUpdateInput {
    return {
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate.value,
      type: vehicle.type,
      updatedAt: vehicle.updatedAt,
    };
  }

  static toDomainList(vehicles: PrismaVehicle[]): Vehicle[] {
    return vehicles.map((vehicle) => this.toDomain(vehicle));
  }
}
