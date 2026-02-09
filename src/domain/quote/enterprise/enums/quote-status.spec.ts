import { expect, test } from "vitest";
import {
  QuoteStatus,
  isEditableStatus,
  isValidStatusTransition,
} from "./quote-status";

test("should allow editing until files are ready", () => {
  expect(isEditableStatus(QuoteStatus.DRAFT)).toBe(true);
  expect(isEditableStatus(QuoteStatus.SUBMITTED)).toBe(true);
  expect(isEditableStatus(QuoteStatus.GENERATING)).toBe(true);
  expect(isEditableStatus(QuoteStatus.READY)).toBe(false);
  expect(isEditableStatus(QuoteStatus.FAILED)).toBe(false);
});

test("should validate allowed transitions", () => {
  const allowed: Array<[QuoteStatus, QuoteStatus]> = [
    [QuoteStatus.DRAFT, QuoteStatus.SUBMITTED],
    [QuoteStatus.SUBMITTED, QuoteStatus.GENERATING],
    [QuoteStatus.GENERATING, QuoteStatus.READY],
    [QuoteStatus.GENERATING, QuoteStatus.FAILED],
    [QuoteStatus.FAILED, QuoteStatus.GENERATING],
  ];

  allowed.forEach(([from, to]) => {
    expect(isValidStatusTransition(from, to)).toBe(true);
  });
});

test("should reject invalid transitions", () => {
  const invalid: Array<[QuoteStatus, QuoteStatus]> = [
    [QuoteStatus.DRAFT, QuoteStatus.GENERATING],
    [QuoteStatus.SUBMITTED, QuoteStatus.READY],
    [QuoteStatus.READY, QuoteStatus.GENERATING],
    [QuoteStatus.READY, QuoteStatus.SUBMITTED],
    [QuoteStatus.FAILED, QuoteStatus.READY],
  ];

  invalid.forEach(([from, to]) => {
    expect(isValidStatusTransition(from, to)).toBe(false);
  });
});
