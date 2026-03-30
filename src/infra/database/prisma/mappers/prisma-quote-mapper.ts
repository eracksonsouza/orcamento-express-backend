import { Quote } from "@/src/domain/quote/enterprise/entities/quote";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import type { QuoteStatus } from "@/src/domain/quote/enterprise/enums/quote-status";
import type {
  Prisma,
  Quote as PrismaQuote,
  QuoteItem as PrismaQuoteItem,
} from "@prisma/client";
import { PrismaQuoteItemMapper } from "./quote-item-mapper";

type PrismaQuoteWithItems = PrismaQuote & { items: PrismaQuoteItem[] };

export class PrismaQuoteMapper {
  /**
   * Converte um registro do Prisma para a entidade de domínio
   */
  static toDomain(raw: PrismaQuoteWithItems): Quote {
    return Quote.create(
      {
        customerId: raw.customerId,
        vehicleId: raw.vehicleId ?? null,
        status: raw.status as QuoteStatus,
        version: raw.version,
        items: PrismaQuoteItemMapper.toDomainList(raw.items),
        subtotal: Number(raw.subtotal),
        discount: Number(raw.discount),
        taxes: Number(raw.taxes),
        paymentDiscount: Number(raw.paymentDiscount),
        paymentMethod: raw.paymentMethod as Quote["paymentMethod"],
        total: Number(raw.total),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  /**
   * Converte a entidade de domínio para criação no Prisma
   */
  static toPersistence(
    quote: Quote,
  ): Prisma.QuoteCreateInput {
    return {
      id: quote.id.toString(),
      customer: { connect: { id: quote.customerId } },
      ...(quote.vehicleId ? { vehicle: { connect: { id: quote.vehicleId } } } : {}),
      version: quote.version,
      status: quote.status,
      subtotal: quote.subtotal,
      discount: quote.discount,
      taxes: quote.taxes,
      paymentDiscount: quote.paymentDiscount,
      paymentMethod: quote.paymentMethod,
      total: quote.total,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
      items: {
        createMany: {
          data: PrismaQuoteItemMapper.toCreateManyInput(quote.items),
        },
      },
    };
  }

  /**
   * Converte a entidade de domínio para atualização no Prisma
   */
  static toUpdatePersistence(quote: Quote): Prisma.QuoteUpdateInput {
    return {
      vehicle: quote.vehicleId ? { connect: { id: quote.vehicleId } } : { disconnect: true },
      version: quote.version,
      status: quote.status,
      subtotal: quote.subtotal,
      discount: quote.discount,
      taxes: quote.taxes,
      paymentDiscount: quote.paymentDiscount,
      paymentMethod: quote.paymentMethod,
      total: quote.total,
      updatedAt: quote.updatedAt,
      items: {
        deleteMany: {},
        createMany: {
          data: PrismaQuoteItemMapper.toCreateManyInput(quote.items),
        },
      },
    };
  }

  /**
   * Converte múltiplos registros do Prisma para entidades de domínio
   */
  static toDomainList(quotes: PrismaQuoteWithItems[]): Quote[] {
    return quotes.map((quote) => this.toDomain(quote));
  }
}
