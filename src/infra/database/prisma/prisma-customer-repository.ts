import type {
  CustomerRepository,
  PaginationParams,
  PaginatedResult,
} from "@/src/domain/repositories/customer-repository";
import prisma from "../../database/prisma/client";
import { Customer } from "@/src/domain/entities/customer";
import { PrismaCustomerMapper } from "./mappers/customer-mapper";

export class PrismaCustomerRepository implements CustomerRepository {
  async save(customer: Customer): Promise<void> {
    const exists = await this.exists(customer.id.toString());

    if (exists) {
      await this.update(customer);
      return;
    }

    await this.create(customer);
  }

  async exists(id: string): Promise<boolean> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { id: true },
    });
    return customer !== null;
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({ where: { id } });
    return customer ? PrismaCustomerMapper.toDomain(customer) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await prisma.customer.findFirst({ where: { email } });
    return customer ? PrismaCustomerMapper.toDomain(customer) : null;
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const customer = await prisma.customer.findFirst({ where: { phone } });
    return customer ? PrismaCustomerMapper.toDomain(customer) : null;
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResult<Customer>> {
    const page = params?.page || 1;
    const perPage = params?.perPage || 10;

    const [data, total] = await prisma.$transaction([
      prisma.customer.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count(),
    ]);

    return {
      data: PrismaCustomerMapper.toDomainList(data),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async search(
    query: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<Customer>> {
    const page = params?.page || 1;
    const perPage = params?.perPage || 10;
    const where = {
      OR: [
        { name: { contains: query, mode: "insensitive" as const } },
        { email: { contains: query, mode: "insensitive" as const } },
        { phone: { contains: query, mode: "insensitive" as const } },
      ],
    };

    const [data, total] = await prisma.$transaction([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: PrismaCustomerMapper.toDomainList(data),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  private async create(customer: Customer): Promise<void> {
    await prisma.customer.create({
      data: PrismaCustomerMapper.toPersistence(customer),
    });
  }

  private async update(customer: Customer): Promise<void> {
    await prisma.customer.update({
      where: { id: customer.id.toString() },
      data: PrismaCustomerMapper.toUpdatePersistence(customer),
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.customer.delete({ where: { id } });
  }
}
