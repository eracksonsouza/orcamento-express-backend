import { expect, test } from "vitest";
import { Phone } from "./phone.js";

test("should create a valid phone", () => {
  const validPhones = [
    "(11) 91234-5678",
    "(21) 1234-5678",
    "11912345678",
    "2112345678",
  ];

  validPhones.forEach((phone) => {
    const created = Phone.create(phone);

    expect(created.value).toMatch(/^\d{10,11}$/);
  });
});

test("should throw error for invalid phone", () => {
  const invalidPhones = [
    "",
    "12345",
    "(11) 91234-567890", // 13 dígitos após limpar
    "abcdefghij", // sem dígitos
    "(11) 9123-567", // 9 dígitos após limpar
    "+55 (11) 91234-5678", // país deixa com 13 dígitos
  ];

  invalidPhones.forEach((invalidPhone) => {
    expect(() => Phone.create(invalidPhone)).toThrowError(`Invalid phone: ${invalidPhone}`);
  });
});

test("should create phone from persistence", () => {
  const persisted = Phone.createFromPersistence("11912345678");

  expect(persisted.value).toBe("11912345678");
});

test("should format phone correctly", () => {
  const mobile = Phone.create("(11) 91234-5678");
  const noSpaceNumber = Phone.create("2112345678");

  expect(mobile.formatted).toBe("(11) 91234-5678");
  expect(noSpaceNumber.formatted).toBe("(21) 1234-5678");
});
