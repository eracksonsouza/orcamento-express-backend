import { Customer } from "@/src/domain/customer/enterprise/entities/customer";
import type {
  PaginationParams,
  PaginatedResult,
  CustomerRepository,
} from "@/src/domain/customer/application/repositories/customer-repository";

export class InMemoryCustomerRepository implements CustomerRepository {
  public customers: Customer[] = [];

  async save(customer: Customer): Promise<void> {
    const index = this.customers.findIndex(
      (c) => c.id.toString() === customer.id.toString(),
    );
    if (index >= 0) {
      this.customers[index] = customer;
    } else {
      this.customers.push(customer);
    }
  }

  async exists(id: string): Promise<boolean> {
    return this.customers.some((c) => c.id.toString() === id);
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = this.customers.find((c) => c.id.toString() === id);
    return customer ?? null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = this.customers.find((c) => c.email === email);
    return customer ?? null;
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const customer = this.customers.find((c) => c.phone === phone);
    return customer ?? null;
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResult<Customer>> {
    const page = params?.page ?? 1;
    const perPage = params?.perPage ?? 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    const data = this.customers.slice(start, end);
    const total = this.customers.length;

    return {
      data,
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
    const page = params?.page ?? 1;
    const perPage = params?.perPage ?? 10;
    const lowerQuery = query.toLowerCase();

    const filtered = this.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email?.toLowerCase().includes(lowerQuery) ||
        c.phone?.toLowerCase().includes(lowerQuery),
    );

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const data = filtered.slice(start, end);
    const total = filtered.length;

    return {
      data,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async delete(id: string): Promise<void> {
    const index = this.customers.findIndex((c) => c.id.toString() === id);
    if (index >= 0) {
      this.customers.splice(index, 1);
    }
  }

  // Helper methods for testing
  clear(): void {
    this.customers = [];
  }
}
