import { Customer } from "@/src/domain/entities/customer";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import type { Customer as PrismaCustomer, Prisma } from "@prisma/client";

export class PrismaCustomerMapper {
  /**
   * Converte um registro do Prisma para a entidade de domínio
   */
  static toDomain(raw: PrismaCustomer): Customer {
    return Customer.create(
      {
        name: raw.name,
        ...(raw.email && { email: raw.email }),
        ...(raw.phone && { phone: raw.phone }),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  /**
   * Converte a entidade de domínio para criação no Prisma
   */
  static toPersistence(customer: Customer): Prisma.CustomerCreateInput {
    return {
      id: customer.id.toString(),
      name: customer.name,
      email: customer.email || null,
      phone: customer.phone || null,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  /**
   * Converte a entidade de domínio para atualização no Prisma
   */
  static toUpdatePersistence(customer: Customer): Prisma.CustomerUpdateInput {
    return {
      name: customer.name,
      email: customer.email || null,
      phone: customer.phone || null,
      updatedAt: customer.updatedAt,
    };
  }

  /**
   * Converte múltiplos registros do Prisma para entidades de domínio
   */
  static toDomainList(customers: PrismaCustomer[]): Customer[] {
    return customers.map((customer) => this.toDomain(customer));
  }
}
