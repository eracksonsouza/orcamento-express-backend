import type { Vehicle } from "@/src/domain/vehicle/enterprise/entities/vehicle";
import type { VehicleWithCustomer } from "@/src/domain/vehicle/application/repositories/vehicle-repository";

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

export function toHttpVehicleWithCustomer({
  vehicle,
  customerName,
}: VehicleWithCustomer) {
  return {
    ...toHttpVehicle(vehicle),
    customerName,
  };
}
