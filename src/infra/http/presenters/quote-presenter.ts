import type { Quote } from "@/src/domain/quote/enterprise/entities/quote";
import type { QuoteItem } from "@/src/domain/quote/enterprise/entities/quote-item";

export function toHttpQuoteItem(item: QuoteItem) {
  return {
    id: item.id.toString(),
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    type: item.type,
    serviceCategory: item.serviceCategory,
    discount: item.discount,
    taxes: item.taxes,
    description: item.description,
    total: item.calculateTotal(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function toHttpQuote(quote: Quote) {
  return {
    id: quote.id.toString(),
    value: quote.value,
    description: quote.description,
    customerId: quote.customerId,
    vehicleId: quote.vehicleId,
    status: quote.status,
    version: quote.version,
    items: quote.items.map(toHttpQuoteItem),
    subtotal: quote.subtotal,
    discount: quote.discount,
    taxes: quote.taxes,
    paymentDiscount: quote.paymentDiscount,
    paymentMethod: quote.paymentMethod,
    total: quote.total,
    createdAt: quote.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: quote.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}
