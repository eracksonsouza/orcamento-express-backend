import { describe, expect, test, beforeEach } from "vitest";
import { PrismaCustomerRepository } from "./prisma-customer-repository";
import { Customer } from "@/src/domain/entities/customer";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import { prismaTest } from "@/src/test/setup/prisma-test-client";

describe("PrismaCustomerRepository", () => {
  let repository: PrismaCustomerRepository;

  beforeEach(() => {
    repository = new PrismaCustomerRepository(prismaTest);
  });

  describe("save", () => {
    test("should create a new customer", async () => {
      const customer = Customer.create({
        name: "John Doe",
        email: "john@example.com",
        phone: "11999999999",
      });

      await repository.save(customer);

      const found = await repository.findById(customer.id.toString());
      expect(found).not.toBeNull();
      expect(found?.name).toBe("John Doe");
      expect(found?.email).toBe("john@example.com");
      expect(found?.phone).toBe("11999999999");
    });

    test("should update an existing customer", async () => {
      const customer = Customer.create({
        name: "John Doe",
        email: "john@example.com",
      });

      await repository.save(customer);

      customer.updateName("Jane Doe");
      customer.updateEmail("jane@example.com");
      await repository.save(customer);

      const found = await repository.findById(customer.id.toString());
      expect(found?.name).toBe("Jane Doe");
      expect(found?.email).toBe("jane@example.com");
    });
  });

  describe("exists", () => {
    test("should return true when customer exists", async () => {
      const customer = Customer.create({ name: "John Doe" });
      await repository.save(customer);

      const exists = await repository.exists(customer.id.toString());
      expect(exists).toBe(true);
    });

    test("should return false when customer does not exist", async () => {
      const exists = await repository.exists("non-existent-id");
      expect(exists).toBe(false);
    });
  });

  describe("findById", () => {
    test("should return customer when found", async () => {
      const customer = Customer.create({
        name: "John Doe",
        email: "john@example.com",
      });
      await repository.save(customer);

      const found = await repository.findById(customer.id.toString());

      expect(found).not.toBeNull();
      expect(found?.id.equals(customer.id)).toBe(true);
      expect(found?.name).toBe("John Doe");
    });

    test("should return null when customer not found", async () => {
      const found = await repository.findById("non-existent-id");
      expect(found).toBeNull();
    });
  });

  describe("findByEmail", () => {
    test("should return customer when email matches", async () => {
      const customer = Customer.create({
        name: "John Doe",
        email: "john@example.com",
      });
      await repository.save(customer);

      const found = await repository.findByEmail("john@example.com");

      expect(found).not.toBeNull();
      expect(found?.email).toBe("john@example.com");
    });

    test("should return null when email not found", async () => {
      const found = await repository.findByEmail("notfound@example.com");
      expect(found).toBeNull();
    });
  });

  describe("findByPhone", () => {
    test("should return customer when phone matches", async () => {
      const customer = Customer.create({
        name: "John Doe",
        phone: "11999999999",
      });
      await repository.save(customer);

      const found = await repository.findByPhone("11999999999");

      expect(found).not.toBeNull();
      expect(found?.phone).toBe("11999999999");
    });

    test("should return null when phone not found", async () => {
      const found = await repository.findByPhone("00000000000");
      expect(found).toBeNull();
    });
  });

  describe("findAll", () => {
    test("should return paginated customers", async () => {
      // Create 15 customers
      for (let i = 1; i <= 15; i++) {
        const customer = Customer.create({
          name: `Customer ${i}`,
          email: `customer${i}@example.com`,
        });
        await repository.save(customer);
      }

      const result = await repository.findAll({ page: 1, perPage: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(15);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(2);
    });

    test("should return second page correctly", async () => {
      for (let i = 1; i <= 15; i++) {
        const customer = Customer.create({ name: `Customer ${i}` });
        await repository.save(customer);
      }

      const result = await repository.findAll({ page: 2, perPage: 10 });

      expect(result.data).toHaveLength(5);
      expect(result.page).toBe(2);
    });

    test("should use default pagination when not provided", async () => {
      const customer = Customer.create({ name: "John Doe" });
      await repository.save(customer);

      const result = await repository.findAll();

      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });
  });

  describe("search", () => {
    test("should find customers by name", async () => {
      const customer1 = Customer.create({ name: "John Doe" });
      const customer2 = Customer.create({ name: "Jane Smith" });
      await repository.save(customer1);
      await repository.save(customer2);

      const result = await repository.search("John");

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.name).toBe("John Doe");
    });

    test("should find customers by email", async () => {
      const customer = Customer.create({
        name: "John Doe",
        email: "john@example.com",
      });
      await repository.save(customer);

      const result = await repository.search("john@example");

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.email).toBe("john@example.com");
    });

    test("should find customers by phone", async () => {
      const customer = Customer.create({
        name: "John Doe",
        phone: "11999999999",
      });
      await repository.save(customer);

      const result = await repository.search("999999");

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.phone).toBe("11999999999");
    });

    test("should be case insensitive", async () => {
      const customer = Customer.create({ name: "John Doe" });
      await repository.save(customer);

      const result = await repository.search("JOHN");

      expect(result.data).toHaveLength(1);
    });

    test("should return paginated results", async () => {
      for (let i = 1; i <= 15; i++) {
        const customer = Customer.create({ name: `John Doe ${i}` });
        await repository.save(customer);
      }

      const result = await repository.search("John", { page: 1, perPage: 5 });

      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(15);
      expect(result.totalPages).toBe(3);
    });
  });

  describe("delete", () => {
    test("should delete an existing customer", async () => {
      const customer = Customer.create({ name: "John Doe" });
      await repository.save(customer);

      await repository.delete(customer.id.toString());

      const found = await repository.findById(customer.id.toString());
      expect(found).toBeNull();
    });

    test("should throw when deleting non-existent customer", async () => {
      await expect(repository.delete("non-existent-id")).rejects.toThrow();
    });
  });

  describe("data integrity", () => {
    test("should preserve createdAt and updatedAt", async () => {
      const customer = Customer.create({ name: "John Doe" });
      const originalCreatedAt = customer.createdAt;

      await repository.save(customer);
      const found = await repository.findById(customer.id.toString());

      expect(found?.createdAt.getTime()).toBe(originalCreatedAt.getTime());
    });

    test("should handle null email and phone", async () => {
      const customer = Customer.create({ name: "John Doe" });
      await repository.save(customer);

      const found = await repository.findById(customer.id.toString());

      expect(found?.email).toBeFalsy();
      expect(found?.phone).toBeFalsy();
    });

    test("should preserve custom id", async () => {
      const customId = new UniqueEntityId("custom-uuid-123");
      const customer = Customer.create({ name: "John Doe" }, customId);

      await repository.save(customer);
      const found = await repository.findById("custom-uuid-123");

      expect(found).not.toBeNull();
      expect(found?.id.toString()).toBe("custom-uuid-123");
    });
  });
});
