import type { CustomerRepository } from "@/src/domain/customer/application/repositories/customer-repository";
import { Customer } from "@/src/domain/customer/enterprise/entities/customer";
import { EmailAlreadyInUseError } from "@/src/domain/customer/enterprise/errors/email-already-in-use-error";
import { PhoneAlreadyInUseError } from "@/src/domain/customer/enterprise/errors/phone-already-in-use-error";

interface CreateCustomerRequest {
  name: string;
  email?: string | null;
  phone?: string | null;
}

interface CreateCustomerResponse {
  customer: Customer;
}

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    name,
    email,
    phone,
  }: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    if (email) {
      const existingByEmail = await this.customerRepository.findByEmail(email);
      if (existingByEmail) {
        throw new EmailAlreadyInUseError();
      }
    }

    if (phone) {
      const existingByPhone = await this.customerRepository.findByPhone(phone);
      if (existingByPhone) {
        throw new PhoneAlreadyInUseError();
      }
    }

    const customer = Customer.create({
      name,
      email: email ?? null,
      phone: phone ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.customerRepository.save(customer);

    return {
      customer,
    };
  }
}
