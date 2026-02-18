import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import type { CustomerRepository } from "@/src/domain/customer/application/repositories/customer-repository";
import { Customer } from "@/src/domain/customer/enterprise/entities/customer";

interface CreateCustomerRequest {
  customerId: string;
  name: string;
  email: string;
  phone: string;
}

interface CreateCustomerResponse {
  customer: Customer;
}

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    customerId,
    name,
    email,
    phone,
  }: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const customer = Customer.create(
      {
        name,
        email,
        phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityId(customerId), 
    );

    await this.customerRepository.save(customer);

    return {
      customer,
    };
  }
}
