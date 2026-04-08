import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import type { CustomerRepository } from "@/src/domain/customer/application/repositories/customer-repository";
import type { Customer } from "@/src/domain/customer/enterprise/entities/customer";
import { CustomerNotFoundError } from "@/src/domain/customer/enterprise/errors/customer-not-found-error";
import { EmailAlreadyInUseError } from "@/src/domain/customer/enterprise/errors/email-already-in-use-error";
import { PhoneAlreadyInUseError } from "@/src/domain/customer/enterprise/errors/phone-already-in-use-error";

interface UpdateCustomerRequest {
  customerId: string;
  name?: string | undefined;
  email?: string | null | undefined;
  phone?: string | null | undefined;
}

interface UpdateCustomerResponse {
  customer: Customer;
}

export class UpdateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    customerId,
    name,
    email,
    phone,
  }: UpdateCustomerRequest): Promise<UpdateCustomerResponse> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    if (email !== undefined && email !== null) {
      const existingByEmail = await this.customerRepository.findByEmail(email);
      if (existingByEmail && !existingByEmail.id.equals(new UniqueEntityId(customerId))) {
        throw new EmailAlreadyInUseError();
      }
    }

    if (phone !== undefined && phone !== null) {
      const existingByPhone = await this.customerRepository.findByPhone(phone);
      if (existingByPhone && !existingByPhone.id.equals(new UniqueEntityId(customerId))) {
        throw new PhoneAlreadyInUseError();
      }
    }

    if (name !== undefined) customer.updateName(name);
    if (email !== undefined) customer.updateEmail(email ?? null);
    if (phone !== undefined) customer.updatePhone(phone ?? null);

    await this.customerRepository.save(customer);

    return { customer };
  }
}
