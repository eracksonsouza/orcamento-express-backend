import type { Vehicle } from "../entities/vehicle";
import type { PaginationParams, PaginatedResult } from "./customer-repository";

export interface VehicleRepository {
  findById(id: string): Promise<Vehicle | null>;
  findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
  findByCustomerId(customerId: string): Promise<Vehicle[]>;
  findAll(params?: PaginationParams): Promise<PaginatedResult<Vehicle>>;
  search(
    query: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<Vehicle>>;
  save(vehicle: Vehicle): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  existsByLicensePlate(licensePlate: string): Promise<boolean>;
}
