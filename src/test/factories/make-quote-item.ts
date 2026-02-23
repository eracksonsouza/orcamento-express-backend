import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import {
  QuoteItem,
  type CreateQuoteItemProps,
} from "@/src/domain/quote/enterprise/entities/quote-item";
import { QuoteItemType } from "@/src/domain/quote/enterprise/enums/quote-item-type";

export function makeQuoteItem(
  override: Partial<CreateQuoteItemProps> = {},
  id?: UniqueEntityId,
) {
  const quoteItem = QuoteItem.create(
    {
      unitPrice: 100,
      quantity: 1,
      type: QuoteItemType.PART,
      description: "Peça de reposição",
      discount: 0,
      taxes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return quoteItem;
}

export function makeServiceQuoteItem(
  override: Partial<CreateQuoteItemProps> = {},
  id?: UniqueEntityId,
) {
  return makeQuoteItem(
    {
      type: QuoteItemType.SERVICE,
      serviceCategory: "MANUTENCAO",
      description: "Serviço de manutenção",
      ...override,
    },
    id,
  );
}

export function makePartQuoteItem(
  override: Partial<CreateQuoteItemProps> = {},
  id?: UniqueEntityId,
) {
  return makeQuoteItem(
    {
      type: QuoteItemType.PART,
      serviceCategory: null,
      description: "Peça",
      ...override,
    },
    id,
  );
}
