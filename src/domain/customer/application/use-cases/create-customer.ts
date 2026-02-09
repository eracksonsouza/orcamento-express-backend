import type { CustomerRepository } from "@/src/domain/customer/application/repositories/customer-repository";
import { Customer } from "@/src/domain/customer/enterprise/entities/customer";

interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
}

export class CreateCustomerUseCase {}
