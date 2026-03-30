import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import {
  Vehicle,
  type CreateVehicleProps,
} from "@/src/domain/vehicle/enterprise/entities/vehicle";

export function makeVehicle(
  createVehicleProps: Partial<CreateVehicleProps> = {},
  id?: UniqueEntityId,
) {
  const vehicle = Vehicle.create(
    {
      customerId: "customer-1",
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      type: "CAR",
      licensePlate: "ABC1234",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...createVehicleProps,
    },
    id,
  );

  return vehicle;
}
