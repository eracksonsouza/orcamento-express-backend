import type {
  CustomerRepository,
  PaginationParams,
  PaginatedResult,
} from "@/src/domain/customer/application/repositories/customer-repository";
import type { Customer } from "@/src/domain/customer/enterprise/entities/customer";
import { paginate } from "./helpers/paginate";
import { searchCustomers } from "./helpers/search-customers";

export class InMemoryCustomerRepository implements CustomerRepository {
  public items: Customer[] = [];

  async save(customer: Customer): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === customer.id.toString(),
    );

    if (index >= 0) {
      this.items[index] = customer;
      return;
    }

    this.items.push(customer);
  }

  async findById(id: string): Promise<Customer | null> {
    return this.items.find((customer) => customer.id.toString() === id) ?? null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.items.find((customer) => customer.email === email) ?? null;
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return this.items.find((customer) => customer.phone === phone) ?? null;
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResult<Customer>> {
    return paginate({ items: this.items, ...(params && { params }) });
  }

  async search(
    query: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<Customer>> {
    const filteredItems = searchCustomers(this.items, query);
    return paginate({ items: filteredItems, ...(params && { params }) });
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((customer) => customer.id.toString() !== id);
  }

  async exists(id: string): Promise<boolean> {
    return this.items.some((customer) => customer.id.toString() === id);
  }
}
