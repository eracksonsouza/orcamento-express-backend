import { expect, test } from "vitest";
import {
  QUOTE_ITEM_TYPE_LABELS,
  QUOTE_ITEM_TYPE_VALUES,
  QuoteItemType,
  isValidQuoteItemType,
} from "./quote-item-type.js";

test("should list all quote item types", () => {
  expect(QUOTE_ITEM_TYPE_VALUES).toEqual([
    QuoteItemType.PART,
    QuoteItemType.SERVICE,
  ]);
});

test("should validate quote item type values", () => {
  QUOTE_ITEM_TYPE_VALUES.forEach((value) => {
    expect(isValidQuoteItemType(value)).toBe(true);
  });

  const invalidValues = ["", "part", "service", "INVALID"];

  invalidValues.forEach((value) => {
    expect(isValidQuoteItemType(value)).toBe(false);
  });
});

test("should expose friendly labels", () => {
  expect(QUOTE_ITEM_TYPE_LABELS[QuoteItemType.PART]).toBe("Peça");
  expect(QUOTE_ITEM_TYPE_LABELS[QuoteItemType.SERVICE]).toBe("Serviço");
});
