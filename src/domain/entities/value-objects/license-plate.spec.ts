import { describe, test, expect } from "vitest";
import { LicensePlate } from "./license-plate";

describe("LicensePlate", () => {
  describe("create", () => {
    test("should create a valid license plate in old format", () => {
      const plate = LicensePlate.create("ABC1234");
      expect(plate.value).toBe("ABC1234");
    });

    test("should create a valid license plate in old format with hyphen", () => {
      const plate = LicensePlate.create("ABC-1234");
      expect(plate.value).toBe("ABC1234");
    });

    test("should create a valid license plate in Mercosul format", () => {
      const plate = LicensePlate.create("ABC1D23");
      expect(plate.value).toBe("ABC1D23");
    });

    test("should create a valid license plate in Mercosul format with hyphen", () => {
      const plate = LicensePlate.create("ABC-1D23");
      expect(plate.value).toBe("ABC1D23");
    });

    test("should normalize lowercase to uppercase", () => {
      const plate = LicensePlate.create("abc1234");
      expect(plate.value).toBe("ABC1234");
    });

    test("should throw error for invalid license plate", () => {
      expect(() => LicensePlate.create("INVALID")).toThrowError(
        "Invalid license plate: INVALID",
      );
    });

    test("should throw error for too short license plate", () => {
      expect(() => LicensePlate.create("ABC123")).toThrowError(
        "Invalid license plate: ABC123",
      );
    });

    test("should throw error for too long license plate", () => {
      expect(() => LicensePlate.create("ABC12345")).toThrowError(
        "Invalid license plate: ABC12345",
      );
    });

    test("should throw error for invalid characters", () => {
      expect(() => LicensePlate.create("AB@1234")).toThrowError(
        "Invalid license plate: AB@1234",
      );
    });
  });

  describe("createFromPersistence", () => {
    test("should create license plate without validation", () => {
      const plate = LicensePlate.createFromPersistence("ABC1234");
      expect(plate.value).toBe("ABC1234");
    });
  });

  describe("isValid", () => {
    test("should return true for valid old format", () => {
      expect(LicensePlate.isValid("ABC1234")).toBe(true);
    });

    test("should return true for valid Mercosul format", () => {
      expect(LicensePlate.isValid("ABC1D23")).toBe(true);
    });

    test("should return false for invalid format", () => {
      expect(LicensePlate.isValid("INVALID")).toBe(false);
    });
  });

  describe("formatted", () => {
    test("should return formatted old format plate", () => {
      const plate = LicensePlate.create("ABC1234");
      expect(plate.formatted()).toBe("ABC-1234");
    });

    test("should return formatted Mercosul plate", () => {
      const plate = LicensePlate.create("ABC1D23");
      expect(plate.formatted()).toBe("ABC-1D23");
    });
  });

  describe("equals", () => {
    test("should return true for equal plates", () => {
      const plate1 = LicensePlate.create("ABC1234");
      const plate2 = LicensePlate.create("ABC-1234");
      expect(plate1.equals(plate2)).toBe(true);
    });

    test("should return false for different plates", () => {
      const plate1 = LicensePlate.create("ABC1234");
      const plate2 = LicensePlate.create("XYZ9876");
      expect(plate1.equals(plate2)).toBe(false);
    });
  });
});
