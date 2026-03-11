import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import type { VehicleRepository } from "../repositories/vehicle-repository";
import { Vehicle } from "../../enterprise/entities/vehicle";
import type { VehicleType } from "../../enterprise/enums/vehicle-type";

interface CreateVehicleRequest {
  vehicleId: string;
  customerId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  type: VehicleType;
}

interface CreateVehicleResponse {
  vehicle: Vehicle;
}

export class CreateVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute({
    vehicleId,
    customerId,
    brand,
    model,
    year,
    licensePlate,
    type,
  }: CreateVehicleRequest): Promise<CreateVehicleResponse> {
    const vehicle = Vehicle.create(
      {
        customerId,
        brand,
        model,
        year,
        licensePlate,
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityId(vehicleId),
    );

    await this.vehicleRepository.save(vehicle);

    return {
      vehicle,
    };
  }
}
