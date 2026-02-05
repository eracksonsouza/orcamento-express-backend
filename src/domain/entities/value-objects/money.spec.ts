import { expect, test } from "vitest";
import { Money } from "./money.js";

test("should create money from decimal", () => {
  const money = Money.fromDecimal(199.9);

  expect(money.inCents).toBe(19990);
  expect(money.inDecimal).toBeCloseTo(199.9);
});

test("should create money from cents", () => {
  const money = Money.fromCents(2500);

  expect(money.inDecimal).toBe(25);
});

test("should throw error for negative values", () => {
  expect(() => Money.fromDecimal(-1)).toThrowError("Money cannot be negative: -1");
  expect(() => Money.fromCents(-100)).toThrowError("Money cannot be negative: -100");
});

test("should throw error for non-integer cents", () => {
  expect(() => Money.fromCents(10.5)).toThrowError("Cents must be an integer: 10.5");
});

test("should create money from persistence", () => {
  const fromString = Money.fromPersistence("123.45");
  const fromNumber = Money.fromPersistence(67.89);

  expect(fromString.inCents).toBe(12345);
  expect(fromNumber.inCents).toBe(6789);
});

test("should format money correctly", () => {
  const money = Money.fromCents(123456);

  expect(money.formatted).toBe("R$ 1.234,56");
});
