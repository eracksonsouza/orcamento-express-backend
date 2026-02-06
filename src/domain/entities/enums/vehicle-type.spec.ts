import { describe, test, expect } from "vitest";
import {
  VehicleType,
  isValidVehicleType,
  getVehicleTypeLabel,
} from "./vehicle-type";

describe("VehicleType", () => {
  describe("values", () => {
    test("should have CAR type", () => {
      expect(VehicleType.CAR).toBe("CAR");
    });

    test("should have MOTORCYCLE type", () => {
      expect(VehicleType.MOTORCYCLE).toBe("MOTORCYCLE");
    });

    test("should have TRUCK type", () => {
      expect(VehicleType.TRUCK).toBe("TRUCK");
    });

    test("should have VAN type", () => {
      expect(VehicleType.VAN).toBe("VAN");
    });

    test("should have SUV type", () => {
      expect(VehicleType.SUV).toBe("SUV");
    });
  });

  describe("isValidVehicleType", () => {
    test("should return true for valid types", () => {
      expect(isValidVehicleType("CAR")).toBe(true);
      expect(isValidVehicleType("MOTORCYCLE")).toBe(true);
      expect(isValidVehicleType("TRUCK")).toBe(true);
      expect(isValidVehicleType("VAN")).toBe(true);
      expect(isValidVehicleType("SUV")).toBe(true);
    });

    test("should return false for invalid types", () => {
      expect(isValidVehicleType("INVALID")).toBe(false);
      expect(isValidVehicleType("car")).toBe(false);
      expect(isValidVehicleType("")).toBe(false);
    });
  });

  describe("getVehicleTypeLabel", () => {
    test("should return correct label for CAR", () => {
      expect(getVehicleTypeLabel(VehicleType.CAR)).toBe("Carro");
    });

    test("should return correct label for MOTORCYCLE", () => {
      expect(getVehicleTypeLabel(VehicleType.MOTORCYCLE)).toBe("Moto");
    });

    test("should return correct label for TRUCK", () => {
      expect(getVehicleTypeLabel(VehicleType.TRUCK)).toBe("Caminhão");
    });

    test("should return correct label for VAN", () => {
      expect(getVehicleTypeLabel(VehicleType.VAN)).toBe("Van");
    });

    test("should return correct label for SUV", () => {
      expect(getVehicleTypeLabel(VehicleType.SUV)).toBe("SUV");
    });
  });
});
