import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import {
  Quote,
  type QuoteProps,
} from "@/src/domain/quote/enterprise/entities/quote";
import { QuoteStatus } from "@/src/domain/quote/enterprise/enums/quote-status";

export function makeQuote(
  override: Partial<QuoteProps> = {},
  id?: UniqueEntityId,
) {
  const quote = Quote.create(
    {
      customerId: new UniqueEntityId().toString(),
      vehicleId: null,
      items: [],
      status: QuoteStatus.DRAFT,
      version: 1,
      subtotal: 0,
      discount: 0,
      taxes: 0,
      paymentDiscount: 0,
      paymentMethod: "UNSPECIFIED",
      total: 0,
      value: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return quote;
}
