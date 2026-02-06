import { describe, it, expect, test } from "vitest";
import { Vehicle } from "./vehicle";
import { VehicleType } from "./enums/vehicle-type";

describe("Vehicle", () => {
  const validProps = {
    brand: "Toyota",
    model: "Corolla",
    year: 2023,
    licensePlate: "ABC1234",
    type: VehicleType.CAR,
  };

  describe("create", () => {
    test("should create a valid vehicle", () => {
      const vehicle = Vehicle.create(validProps);

      expect(vehicle.brand).toBe("Toyota");
      expect(vehicle.model).toBe("Corolla");
      expect(vehicle.year).toBe(2023);
      expect(vehicle.licensePlate.value).toBe("ABC1234");
      expect(vehicle.type).toBe(VehicleType.CAR);
      expect(vehicle.createdAt).toBeInstanceOf(Date);
      expect(vehicle.updatedAt).toBeInstanceOf(Date);
    });

    test("should create vehicle with Mercosul license plate", () => {
      const vehicle = Vehicle.create({
        ...validProps,
        licensePlate: "ABC1D23",
      });

      expect(vehicle.licensePlate.value).toBe("ABC1D23");
    });

    test("should create motorcycle", () => {
      const vehicle = Vehicle.create({
        ...validProps,
        type: VehicleType.MOTORCYCLE,
      });

      expect(vehicle.type).toBe(VehicleType.MOTORCYCLE);
    });

    test("should trim brand and model", () => {
      const vehicle = Vehicle.create({
        ...validProps,
        brand: "  Toyota  ",
        model: "  Corolla  ",
      });

      expect(vehicle.brand).toBe("Toyota");
      expect(vehicle.model).toBe("Corolla");
    });

    test("should throw error for empty brand", () => {
      expect(() => Vehicle.create({ ...validProps, brand: "" })).toThrowError(
        "Brand is required",
      );
    });

    test("should throw error for whitespace-only brand", () => {
      expect(() =>
        Vehicle.create({ ...validProps, brand: "   " }),
      ).toThrowError("Brand is required");
    });

    test("should throw error for empty model", () => {
      expect(() => Vehicle.create({ ...validProps, model: "" })).toThrowError(
        "Model is required",
      );
    });

    test("should throw error for invalid year (too old)", () => {
      expect(() => Vehicle.create({ ...validProps, year: 1899 })).toThrowError(
        "Invalid year",
      );
    });

    test("should throw error for invalid year (future)", () => {
      const futureYear = new Date().getFullYear() + 2;
      expect(() =>
        Vehicle.create({ ...validProps, year: futureYear }),
      ).toThrowError("Invalid year");
    });

    test("should allow next year (0km vehicles)", () => {
      const nextYear = new Date().getFullYear() + 1;
      const vehicle = Vehicle.create({ ...validProps, year: nextYear });
      expect(vehicle.year).toBe(nextYear);
    });

    test("should throw error for invalid license plate", () => {
      expect(() =>
        Vehicle.create({ ...validProps, licensePlate: "INVALID" }),
      ).toThrowError("Invalid license plate: INVALID");
    });
  });

  describe("update methods", () => {
    test("should update brand", () => {
      const vehicle = Vehicle.create(validProps);
      const originalUpdatedAt = vehicle.updatedAt;

      // Wait a bit to ensure different timestamp
      vehicle.updateBrand("Honda");

      expect(vehicle.brand).toBe("Honda");
      expect(vehicle.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    test("should update model", () => {
      const vehicle = Vehicle.create(validProps);
      vehicle.updateModel("Civic");
      expect(vehicle.model).toBe("Civic");
    });

    test("should update year", () => {
      const vehicle = Vehicle.create(validProps);
      vehicle.updateYear(2024);
      expect(vehicle.year).toBe(2024);
    });

    test("should throw error when updating to invalid year", () => {
      const vehicle = Vehicle.create(validProps);
      expect(() => vehicle.updateYear(1800)).toThrowError("Invalid year");
    });

    test("should update license plate", () => {
      const vehicle = Vehicle.create(validProps);
      vehicle.updateLicensePlate("XYZ9876");
      expect(vehicle.licensePlate.value).toBe("XYZ9876");
    });

    test("should throw error when updating to invalid license plate", () => {
      const vehicle = Vehicle.create(validProps);
      expect(() => vehicle.updateLicensePlate("INVALID")).toThrowError(
        "Invalid license plate: INVALID",
      );
    });

    test("should update type", () => {
      const vehicle = Vehicle.create(validProps);
      vehicle.updateType(VehicleType.SUV);
      expect(vehicle.type).toBe(VehicleType.SUV);
    });

    test("should throw error when updating to invalid type", () => {
      const vehicle = Vehicle.create(validProps);
      expect(() => vehicle.updateType("INVALID" as VehicleType)).toThrowError(
        "Invalid vehicle type: INVALID",
      );
    });
  });
});
