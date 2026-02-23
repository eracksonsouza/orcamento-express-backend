import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import {
  Customer,
  type CustomerProps,
} from "@/src/domain/customer/enterprise/entities/customer";

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityId,
) {
  const customer = Customer.create(
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return customer;
}
