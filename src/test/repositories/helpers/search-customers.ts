import type { Customer } from "@/src/domain/customer/enterprise/entities/customer";

export function searchCustomers(
  customers: Customer[],
  query: string,
): Customer[] {
  const normalizedQuery = query.toLowerCase();

  return customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(normalizedQuery) ||
      customer.email.toLowerCase().includes(normalizedQuery) ||
      customer.phone.toLowerCase().includes(normalizedQuery),
  );
}
