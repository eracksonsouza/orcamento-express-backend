import type { VehicleRepository } from "../repositories/vehicle-repository";
import type { VehicleType } from "../../enterprise/enums/vehicle-type";
import { VehicleNotFoundError } from "../../enterprise/errors/vehicle-not-found-error";

interface UpdateVehicleRequest {
  vehicleId: string;
  brand?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  type?: VehicleType;
}

interface UpdateVehicleResponse {
  vehicleId: string;
}

export class UpdateVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute({
    vehicleId,
    brand,
    model,
    year,
    licensePlate,
    type,
  }: UpdateVehicleRequest): Promise<UpdateVehicleResponse> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);

    if (!vehicle) {
      throw new VehicleNotFoundError();
    }

    if (brand !== undefined) {
      vehicle.updateBrand(brand);
    }

    if (model !== undefined) {
      vehicle.updateModel(model);
    }

    if (year !== undefined) {
      vehicle.updateYear(year);
    }

    if (licensePlate !== undefined) {
      vehicle.updateLicensePlate(licensePlate);
    }

    if (type !== undefined) {
      vehicle.updateType(type);
    }

    await this.vehicleRepository.save(vehicle);

    return {
      vehicleId: vehicle.id.toString(),
    };
  }
}
