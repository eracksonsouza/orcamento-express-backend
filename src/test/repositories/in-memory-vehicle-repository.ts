import type { VehicleRepository } from "@/src/domain/vehicle/application/repositories/vehicle-repository";
import type { Vehicle } from "@/src/domain/vehicle/enterprise/entities/vehicle";
import type {
  PaginationParams,
  PaginatedResult,
} from "@/src/domain/customer/application/repositories/customer-repository";
import { paginate } from "./helpers/paginate";

export class InMemoryVehicleRepository implements VehicleRepository {
  create(arg0: {
    vehicleId: string;
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    type: string;
  }) {
    throw new Error("Method not implemented.");
  }
  public items: Vehicle[] = [];
  private vehiclesByCustomer: Map<string, Set<string>> = new Map();

  async save(vehicle: Vehicle): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === vehicle.id.toString(),
    );

    if (index >= 0) {
      this.items[index] = vehicle;
      return;
    }

    this.items.push(vehicle);

    // Automatically track customer association from the entity
    const customerId = vehicle.customerId;
    const current =
      this.vehiclesByCustomer.get(customerId) ?? new Set<string>();
    current.add(vehicle.id.toString());
    this.vehiclesByCustomer.set(customerId, current);
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.items.find((vehicle) => vehicle.id.toString() === id) ?? null;
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    return (
      this.items.find(
        (vehicle) => vehicle.licensePlate.value === licensePlate,
      ) ?? null
    );
  }

  async findByCustomerId(customerId: string): Promise<Vehicle[]> {
    const vehicleIds = this.vehiclesByCustomer.get(customerId);

    if (!vehicleIds) {
      return [];
    }

    return this.items.filter((vehicle) =>
      vehicleIds.has(vehicle.id.toString()),
    );
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResult<Vehicle>> {
    return paginate({ items: this.items, ...(params && { params }) });
  }

  async search(
    query: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<Vehicle>> {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredItems = this.items.filter(
      (vehicle) =>
        vehicle.id.toString().toLowerCase().includes(normalizedQuery) ||
        vehicle.brand.toLowerCase().includes(normalizedQuery) ||
        vehicle.model.toLowerCase().includes(normalizedQuery) ||
        vehicle.licensePlate.value.toLowerCase().includes(normalizedQuery) ||
        vehicle.type.toLowerCase().includes(normalizedQuery),
    );

    return paginate({ items: filteredItems, ...(params && { params }) });
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((vehicle) => vehicle.id.toString() !== id);
  }

  async exists(id: string): Promise<boolean> {
    return this.items.some((vehicle) => vehicle.id.toString() === id);
  }

  async existsByLicensePlate(licensePlate: string): Promise<boolean> {
    return this.items.some(
      (vehicle) => vehicle.licensePlate.value === licensePlate,
    );
  }

  attachVehicleToCustomer(customerId: string, vehicleId: string): void {
    const current =
      this.vehiclesByCustomer.get(customerId) ?? new Set<string>();
    current.add(vehicleId);
    this.vehiclesByCustomer.set(customerId, current);
  }
}
