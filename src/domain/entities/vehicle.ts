import { Entity } from "../../core/entities/entity";
import { UniqueEntityId } from "../../core/entities/unique-entity-id";
import { VehicleType, isValidVehicleType } from "./enums/vehicle-type";
import { LicensePlate } from "./value-objects/license-plate";

export interface VehicleProps {
  brand: string;
  model: string;
  year: number;
  licensePlate: LicensePlate;
  type: VehicleType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleProps {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  type: VehicleType;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Vehicle extends Entity<VehicleProps> {
  get brand(): string {
    return this.props.brand;
  }

  get model(): string {
    return this.props.model;
  }

  get year(): number {
    return this.props.year;
  }

  get licensePlate(): LicensePlate {
    return this.props.licensePlate;
  }

  get type(): VehicleType {
    return this.props.type;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateBrand(brand: string): void {
    this.props.brand = brand;
    this.touch();
  }

  updateModel(model: string): void {
    this.props.model = model;
    this.touch();
  }

  updateYear(year: number): void {
    if (!Vehicle.isValidYear(year)) {
      throw new Error("Invalid year");
    }
    this.props.year = year;
    this.touch();
  }

  updateLicensePlate(licensePlate: string): void {
    this.props.licensePlate = LicensePlate.create(licensePlate);
    this.touch();
  }

  updateType(type: VehicleType): void {
    if (!isValidVehicleType(type)) {
      throw new Error(`Invalid vehicle type: ${type}`);
    }
    this.props.type = type;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private static isValidYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    const minYear = 1900;
    const maxYear = currentYear + 1; // Permite ano seguinte (veículos 0km)
    return year >= minYear && year <= maxYear;
  }

  static create(props: CreateVehicleProps, id?: UniqueEntityId): Vehicle {
    if (!props.brand || props.brand.trim() === "") {
      throw new Error("Brand is required");
    }

    if (!props.model || props.model.trim() === "") {
      throw new Error("Model is required");
    }

    if (!Vehicle.isValidYear(props.year)) {
      throw new Error("Invalid year");
    }

    if (!isValidVehicleType(props.type)) {
      throw new Error(`Invalid vehicle type: ${props.type}`);
    }

    const licensePlate = LicensePlate.create(props.licensePlate);

    return new Vehicle(
      {
        brand: props.brand.trim(),
        model: props.model.trim(),
        year: props.year,
        licensePlate,
        type: props.type,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
