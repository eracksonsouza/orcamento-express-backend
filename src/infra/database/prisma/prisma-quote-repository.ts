import type {
  QuoteRepository,
  QuoteFilters,
} from "@/src/domain/quote/application/repositories/quote-repository";
import type {
  PaginationParams,
  PaginatedResult,
} from "@/src/domain/customer/application/repositories/customer-repository";
import type { PrismaClient } from "@prisma/client";
import { QuoteStatus as PrismaQuoteStatus } from "@prisma/client";
import prismaClient from "@/src/infra/database/prisma/client";
import { Quote } from "@/src/domain/quote/enterprise/entities/quote";
import type { QuoteStatus } from "@/src/domain/quote/enterprise/enums/quote-status";
import { Prisma } from "@prisma/client";
import { PrismaQuoteMapper } from "./mappers/prisma-quote-mapper";

const INCLUDE_ITEMS = { items: true } as const;

export class PrismaQuoteRepository implements QuoteRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? prismaClient;
  }

  async save(quote: Quote): Promise<void> {
    const exists = await this.exists(quote.id.toString());

    if (exists) {
      await this.update(quote);
    } else {
      await this.create(quote);
    }
  }

  async exists(id: string): Promise<boolean> {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      select: { id: true },
    });
    return quote !== null;
  }

  async findById(id: string): Promise<Quote | null> {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: INCLUDE_ITEMS,
    });
    return quote ? PrismaQuoteMapper.toDomain(quote) : null;
  }

  async findByCustomerId(customerId: string): Promise<Quote[]> {
    const quotes = await this.prisma.quote.findMany({
      where: { customerId },
      include: INCLUDE_ITEMS,
      orderBy: { createdAt: "desc" },
    });
    return PrismaQuoteMapper.toDomainList(quotes);
  }

  async findByStatus(status: QuoteStatus): Promise<Quote[]> {
    const quotes = await this.prisma.quote.findMany({
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

    const [data, total] = await this.prisma.$transaction([
      this.prisma.quote.findMany({
        where,
        include: INCLUDE_ITEMS,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.quote.count({ where }),
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
    const quotes = await this.prisma.quote.findMany({
      where: { parentId },
      include: INCLUDE_ITEMS,
      orderBy: { version: "asc" },
    });
    return PrismaQuoteMapper.toDomainList(quotes);
  }

  async search(
    query: string,
    params?: PaginationParams,
    filters?: QuoteFilters,
  ): Promise<PaginatedResult<Quote>> {
    const page = params?.page || 1;
    const perPage = params?.perPage || 10;
    const normalizedQuery = query.trim();
    const where = this.buildWhereClause(filters);
    const statusQuery = normalizedQuery.toUpperCase() as PrismaQuoteStatus;
    const isValidStatus = Object.values(PrismaQuoteStatus).includes(
      statusQuery,
    );

    const searchWhere: Prisma.QuoteWhereInput = {
      ...where,
      OR: [
        { id: { contains: normalizedQuery, mode: "insensitive" } },
        { customerId: { contains: normalizedQuery, mode: "insensitive" } },
        ...(isValidStatus
          ? [{ status: { equals: statusQuery } }]
          : []),
        {
          items: {
            some: {
              description: { contains: normalizedQuery, mode: "insensitive" },
            },
          },
        },
      ],
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.quote.findMany({
        where: searchWhere,
        include: INCLUDE_ITEMS,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.quote.count({ where: searchWhere }),
    ]);

    return {
      data: PrismaQuoteMapper.toDomainList(data),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.quote.delete({ where: { id } });
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

  private async create(quote: Quote): Promise<void> {
    await this.prisma.quote.create({
      data: PrismaQuoteMapper.toPersistence(quote),
    });
  }

  async update(quote: Quote): Promise<void> {
    await this.prisma.quote.update({
      where: { id: quote.id.toString() },
      data: PrismaQuoteMapper.toUpdatePersistence(quote),
    });
  }
}
