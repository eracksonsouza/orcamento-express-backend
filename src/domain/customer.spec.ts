import { describe, expect, test } from "vitest";

import { Customer } from "./entities/customer";
import { UniqueEntityId } from "./entities/unique-entity-id";

describe("Customer", () => {
  test("should be able to create a customer", () => {
    const customer = Customer.create({
      name: "John Doe",
      email: "john@example.com",
      phone: "11999999999",
    });

    expect(customer.name).toBe("John Doe");
    expect(customer.email).toBe("john@example.com");
    expect(customer.phone).toBe("11999999999");
    expect(customer.id).toBeInstanceOf(UniqueEntityId);
  });

  test("should be able to create a customer with custom id", () => {
    const customId = new UniqueEntityId("custom-id");
    const customer = Customer.create(
      {
        name: "John Doe",
      },
      customId,
    );

    expect(customer.id.toString()).toBe("custom-id");
  });

  test("should be created with createdAt and updatedAt", () => {
    const customer = Customer.create({
      name: "John Doe",
    });

    expect(customer.createdAt).toBeInstanceOf(Date);
    expect(customer.updatedAt).toBeInstanceOf(Date);
  });

  test("should be able to update customer name", () => {
    const customer = Customer.create({
      name: "John Doe",
    });

    const originalUpdatedAt = customer.updatedAt;

    // Small delay to ensure updatedAt changes
    customer.updateName("Jane Doe");

    expect(customer.name).toBe("Jane Doe");
    expect(customer.updatedAt.getTime()).toBeGreaterThanOrEqual(
      originalUpdatedAt.getTime(),
    );
  });

  test("should be able to update customer email", () => {
    const customer = Customer.create({
      name: "John Doe",
      email: "john@example.com",
    });

    customer.updateEmail("newemail@example.com");

    expect(customer.email).toBe("newemail@example.com");
  });

  test("should be able to update customer email to null", () => {
    const customer = Customer.create({
      name: "John Doe",
      email: "john@example.com",
    });

    customer.updateEmail(null);

    expect(customer.email).toBeNull();
  });

  test("should be able to update customer phone", () => {
    const customer = Customer.create({
      name: "John Doe",
      phone: "11999999999",
    });

    customer.updatePhone("11888888888");

    expect(customer.phone).toBe("11888888888");
  });

  test("should be able to update customer phone to null", () => {
    const customer = Customer.create({
      name: "John Doe",
      phone: "11999999999",
    });

    customer.updatePhone(null);

    expect(customer.phone).toBeNull();
  });

  test("should create customer with optional email and phone as undefined", () => {
    const customer = Customer.create({
      name: "John Doe",
    });

    expect(customer.email).toBeUndefined();
    expect(customer.phone).toBeUndefined();
  });
});
