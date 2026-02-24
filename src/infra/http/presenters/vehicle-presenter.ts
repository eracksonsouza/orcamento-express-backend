import type { Vehicle } from "@/src/domain/vehicle/enterprise/entities/vehicle";

export function toHttpVehicle(vehicle: Vehicle) {
  return {
    id: vehicle.id.toString(),
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    licensePlate: vehicle.licensePlate.value,
    type: vehicle.type,
    createdAt: vehicle.createdAt.toISOString(),
    updatedAt: vehicle.updatedAt.toISOString(),
  };
}
