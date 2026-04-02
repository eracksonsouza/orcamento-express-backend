import type {
  VehicleRepository,
  VehicleWithCustomer,
} from "../repositories/vehicle-repository";

interface ListVehiclesRequest {
  search?: string;
  page?: number;
  perPage?: number;
}

interface ListVehiclesResponse {
  vehicles: VehicleWithCustomer[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export class ListVehiclesUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute({
    search,
    page = 1,
    perPage = 20,
  }: ListVehiclesRequest): Promise<ListVehiclesResponse> {
    const result =
      search?.trim()
        ? await this.vehicleRepository.searchWithCustomer(search, {
            page,
            perPage,
          })
        : await this.vehicleRepository.findAllWithCustomer({ page, perPage });

    return {
      vehicles: result.data,
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      totalPages: result.totalPages,
    };
  }
}
