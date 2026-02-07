import { QuoteItem } from "@/src/domain/entities/quote-item";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import type { QuoteItem as PrismaQuoteItem, Prisma } from "@prisma/client";
import { QuoteItemType } from "@/src/domain/entities/enums/quote-item-type";

export class PrismaQuoteItemMapper {
  /**
   * Converte um registro do Prisma para a entidade de domínio
   */
  static toDomain(raw: PrismaQuoteItem): QuoteItem {
    return QuoteItem.create(
      {
        description: raw.description,
        quantity: raw.quantity,
        unitPrice: Number(raw.unitPrice),
        type: raw.type as QuoteItemType,
      },
      new UniqueEntityId(raw.id),
    );
  }

  /**
   * Converte a entidade de domínio para criação em massa no Prisma
   */
  static toCreateManyInput(
    items: QuoteItem[],
  ): Prisma.QuoteItemCreateManyQuoteInput[] {
    return items.map((item) => ({
      id: item.id.toString(),
      description: item.description ?? "",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: 0,
      taxes: 0,
      type: item.type,
    }));
  }

  /**
   * Converte múltiplos registros do Prisma para entidades de domínio
   */
  static toDomainList(items: PrismaQuoteItem[]): QuoteItem[] {
    return items.map((item) => this.toDomain(item));
  }
}
