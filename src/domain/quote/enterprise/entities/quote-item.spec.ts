import { QuoteItem } from "./quote-item";
import { QuoteItemType } from "@/src/domain/quote/enterprise/enums/quote-item-type";

test("should validate quantity > 0", () => {
  const invalidQuantities = [0, -1, -10];

  invalidQuantities.forEach((quantity) => {
    expect(() =>
      QuoteItem.create({ unitPrice: 100, quantity, type: QuoteItemType.PART }),
    ).toThrowError("Quantity must be greater than 0");
  });
});

test("should validate unitPrice >= 0", () => {
  const invalidPrices = [-1, -100, -0.01];

  invalidPrices.forEach((unitPrice) => {
    expect(() =>
      QuoteItem.create({ unitPrice, quantity: 1, type: QuoteItemType.PART }),
    ).toThrowError("Unit price must be greater than or equal to 0");
  });

  // Zero is valid
  const zeroPrice = QuoteItem.create({
    unitPrice: 0,
    quantity: 1,
    type: QuoteItemType.SERVICE,
  });
  expect(zeroPrice.unitPrice).toBe(0);
});

test("should validate type PART or SERVICE", () => {
  const partItem = QuoteItem.create({
    unitPrice: 50,
    quantity: 2,
    type: QuoteItemType.PART,
  });
  const serviceItem = QuoteItem.create({
    unitPrice: 100,
    quantity: 1,
    type: QuoteItemType.SERVICE,
  });

  expect(partItem.type).toBe(QuoteItemType.PART);
  expect(serviceItem.type).toBe(QuoteItemType.SERVICE);

  expect(() =>
    QuoteItem.create({
      unitPrice: 50,
      quantity: 1,
      type: "INVALID" as QuoteItemType,
    }),
  ).toThrowError("Invalid item type: INVALID");
});

test("should calculate total correctly", () => {
  const item = QuoteItem.create({
    unitPrice: 25.5,
    quantity: 4,
    type: QuoteItemType.PART,
  });

  expect(item.calculateTotal()).toBe(102);
});
