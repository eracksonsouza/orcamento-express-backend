import type { VehicleRepository } from "../repositories/vehicle-repository";
import type { Vehicle } from "../../enterprise/entities/vehicle";

interface ListVehiclesByCustomerRequest {
  customerId: string;
}

interface ListVehiclesByCustomerResponse {
  vehicles: Vehicle[];
}

export class ListVehiclesByCustomerUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute({
    customerId,
  }: ListVehiclesByCustomerRequest): Promise<ListVehiclesByCustomerResponse> {
    const vehicles = await this.vehicleRepository.findByCustomerId(customerId);

    return {
      vehicles,
    };
  }
}
