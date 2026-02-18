import { VehicleNotFoundError } from "../../enterprise/errors/vehicle-not-found-error";
import type { VehicleRepository } from "../repositories/vehicle-repository";

interface DeleteVehicleRequest {
  vehicleId: string;
}

interface DeleteVehicleResponse {
  vehicleId: string;
}

export class DeleteVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}
  async execute({
    vehicleId,
  }: DeleteVehicleRequest): Promise<DeleteVehicleResponse> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new VehicleNotFoundError();
    }

    await this.vehicleRepository.delete(vehicleId);

    return { vehicleId: vehicle.id.toString() };
  }
}
