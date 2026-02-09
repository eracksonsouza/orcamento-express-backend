import { QuoteItem } from "@/src/domain/quote/enterprise/entities/quote-item";

export interface QuoteTotals {
  subtotal: number;
  total: number;
  value: number;
}

export function calculateQuoteTotals(items: QuoteItem[]): QuoteTotals {
  const subtotal = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );

  // espaço para impostos/descontos/taxas futuramente
  const total = subtotal;

  return {
    subtotal,
    total,
    value: total,
  };
}
