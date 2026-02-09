import type { CustomerRepository } from "@/src/domain/customer/application/repositories/customer-repository";
import { Customer } from "@/src/domain/customer/enterprise/entities/customer";

interface ListCustomersRequest {
  page?: number;
  perPage?: number;
  query?: string;
}

interface ListCustomersResponse {
  customers: Customer[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export class ListCustomersUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    page = 1,
    perPage = 10,
    query,
  }: ListCustomersRequest = {}): Promise<ListCustomersResponse> {
    const result = query
      ? await this.customerRepository.search(query, { page, perPage })
      : await this.customerRepository.findAll({ page, perPage });

    return {
      customers: result.data,
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      totalPages: result.totalPages,
    };
  }
}
