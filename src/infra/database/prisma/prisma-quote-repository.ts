import type {
  QuoteRepository,
  QuoteFilters,
} from "@/src/domain/repositories/quote-repository";
import type {
  PaginationParams,
  PaginatedResult,
} from "@/src/domain/repositories/customer-repository";
import prisma from "../../database/prisma/client";
import { Quote } from "@/src/domain/entities/quote";
import type { QuoteStatus } from "@/src/domain/entities/enums/quote-status";
import { Prisma } from "@prisma/client";
import { PrismaQuoteMapper } from "./mappers/prisma-quote-mapper";

const INCLUDE_ITEMS = { items: true } as const;

export class PrismaQuoteRepository implements QuoteRepository {
  async save(quote: Quote, customerId?: string): Promise<void> {
    const exists = await this.exists(quote.id.toString());

    if (exists) {
      await this.update(quote);
    } else {
      if (!customerId) {
        throw new Error("customerId is required when creating a new quote");
      }
      await this.create(quote, customerId);
    }
  }

  async exists(id: string): Promise<boolean> {
    const quote = await prisma.quote.findUnique({
      where: { id },
      select: { id: true },
    });
    return quote !== null;
  }

  async findById(id: string): Promise<Quote | null> {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: INCLUDE_ITEMS,
    });
    return quote ? PrismaQuoteMapper.toDomain(quote) : null;
  }

  async findByCustomerId(customerId: string): Promise<Quote[]> {
    const quotes = await prisma.quote.findMany({
      where: { customerId },
      include: INCLUDE_ITEMS,
      orderBy: { createdAt: "desc" },
    });
    return PrismaQuoteMapper.toDomainList(quotes);
  }

  async findByStatus(status: QuoteStatus): Promise<Quote[]> {
    const quotes = await prisma.quote.findMany({
      where: { status },
      include: INCLUDE_ITEMS,
      orderBy: { createdAt: "desc" },
    });
    return PrismaQuoteMapper.toDomainList(quotes);
  }

  async findAll(
    params?: PaginationParams,
    filters?: QuoteFilters,
  ): Promise<PaginatedResult<Quote>> {
    const page = params?.page || 1;
    const perPage = params?.perPage || 10;
    const where = this.buildWhereClause(filters);

    const [data, total] = await prisma.$transaction([
      prisma.quote.findMany({
        where,
        include: INCLUDE_ITEMS,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      prisma.quote.count({ where }),
    ]);

    return {
      data: PrismaQuoteMapper.toDomainList(data),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async findVersions(parentId: string): Promise<Quote[]> {
    const quotes = await prisma.quote.findMany({
      where: { parentId },
      include: INCLUDE_ITEMS,
      orderBy: { version: "asc" },
    });
    return PrismaQuoteMapper.toDomainList(quotes);
  }

  async delete(id: string): Promise<void> {
    await prisma.quote.delete({ where: { id } });
  }

  private buildWhereClause(filters?: QuoteFilters): Prisma.QuoteWhereInput {
    if (!filters) return {};

    return {
      ...(filters.customerId && { customerId: filters.customerId }),
      ...(filters.status && { status: filters.status }),
      ...((filters.startDate || filters.endDate) && {
        createdAt: {
          ...(filters.startDate && { gte: filters.startDate }),
          ...(filters.endDate && { lte: filters.endDate }),
        },
      }),
    };
  }

  private async create(quote: Quote, customerId: string): Promise<void> {
    await prisma.quote.create({
      data: PrismaQuoteMapper.toPersistence(quote, customerId),
    });
  }

  private async update(quote: Quote): Promise<void> {
    await prisma.quote.update({
      where: { id: quote.id.toString() },
      data: PrismaQuoteMapper.toUpdatePersistence(quote),
    });
  }
}
