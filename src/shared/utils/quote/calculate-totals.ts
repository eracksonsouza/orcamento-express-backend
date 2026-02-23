import { QuoteItem } from "@/src/domain/quote/enterprise/entities/quote-item";

export interface QuoteTotals {
  subtotal: number;
  total: number;
  value: number;
}

export interface QuoteTotalsAdjustments {
  discount?: number;
  taxes?: number;
  paymentDiscount?: number;
}

export function calculateQuoteTotals(
  items: QuoteItem[],
  adjustments: QuoteTotalsAdjustments = {},
): QuoteTotals {
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const itemsTotal = items.reduce((acc, item) => acc + item.calculateTotal(), 0);

  const discount = adjustments.discount ?? 0;
  const taxes = adjustments.taxes ?? 0;
  const paymentDiscount = adjustments.paymentDiscount ?? 0;
  const total = Math.max(0, itemsTotal - discount - paymentDiscount + taxes);

  return {
    subtotal,
    total,
    value: total,
  };
}
