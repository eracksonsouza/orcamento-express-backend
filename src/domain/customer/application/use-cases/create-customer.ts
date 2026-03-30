import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import type { CustomerRepository } from "@/src/domain/customer/application/repositories/customer-repository";
import { Customer } from "@/src/domain/customer/enterprise/entities/customer";
import { EmailAlreadyInUseError } from "@/src/domain/customer/enterprise/errors/email-already-in-use-error";
import { PhoneAlreadyInUseError } from "@/src/domain/customer/enterprise/errors/phone-already-in-use-error";

interface CreateCustomerRequest {
  customerId?: string;
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
    // Validar unicidade de email se fornecido
    if (email) {
      const existingByEmail = await this.customerRepository.findByEmail(email);
      if (
        existingByEmail &&
        !existingByEmail.id.equals(new UniqueEntityId(customerId))
      ) {
        throw new EmailAlreadyInUseError();
      }
    }

    // Validar unicidade de phone se fornecido
    if (phone) {
      const existingByPhone = await this.customerRepository.findByPhone(phone);
      if (
        existingByPhone &&
        !existingByPhone.id.equals(new UniqueEntityId(customerId))
      ) {
        throw new PhoneAlreadyInUseError();
      }
    }

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
