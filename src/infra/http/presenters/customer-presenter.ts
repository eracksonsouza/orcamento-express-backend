import type { Customer } from "@/src/domain/customer/enterprise/entities/customer";

export function toHttpCustomer(customer: Customer) {
  return {
    id: customer.id.toString(),
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}
