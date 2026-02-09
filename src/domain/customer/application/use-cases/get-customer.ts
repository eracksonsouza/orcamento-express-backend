import type { CustomerRepository } from "@/src/domain/customer/application/repositories/customer-repository";
import { Customer } from "@/src/domain/customer/enterprise/entities/customer";
import { CustomerNotFoundError } from "@/src/domain/customer/enterprise/errors/customer-not-found-error";

interface GetCustomerRequest {
  customerId: string;
}

interface GetCustomerResponse {
  customer: Customer;
}

export class GetCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    customerId,
  }: GetCustomerRequest): Promise<GetCustomerResponse> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    return {
      customer,
    };
  }
}
