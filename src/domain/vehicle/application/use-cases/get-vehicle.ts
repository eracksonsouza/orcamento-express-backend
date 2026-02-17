import type { VehicleRepository } from "../repositories/vehicle-repository";
import type { Vehicle } from "../../enterprise/entities/vehicle";
import { VehicleNotFoundError } from "../../enterprise/errors/vehicle-not-found-error";

interface GetVehicleRequest {
  vehicleId: string;
}

interface GetVehicleResponse {
  vehicle: Vehicle;
}

export class GetVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute({
    vehicleId,
  }: GetVehicleRequest): Promise<GetVehicleResponse> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);

    if (!vehicle) {
      throw new VehicleNotFoundError();
    }

    return {
      vehicle,
    };
  }
}
