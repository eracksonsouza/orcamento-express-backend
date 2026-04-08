import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { CreateCustomerUseCase } from "./create-customer";
import { ListCustomersUseCase } from "./list-customers";

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let createCustomer: CreateCustomerUseCase;
let sut: ListCustomersUseCase;

describe("List Customers", () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    createCustomer = new CreateCustomerUseCase(inMemoryCustomerRepository);
    sut = new ListCustomersUseCase(inMemoryCustomerRepository);
  });

  test("should be able to list customers", async () => {
    await createCustomer.execute({
      name: "John Doe",
      email: "john@example.com",
      phone: "11111111111",
    });

    await createCustomer.execute({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "22222222222",
    });

    const result = await sut.execute();

    expect(result.customers).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(10);
  });

  test("should return an empty list when there are no customers", async () => {
    const result = await sut.execute();

    expect(result.customers).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  test("should be able to search customers by query", async () => {
    await createCustomer.execute({
      name: "John Doe",
      email: "john@example.com",
      phone: "11111111111",
    });

    await createCustomer.execute({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "22222222222",
    });

    const result = await sut.execute({
      query: "john",
    });

    expect(result.customers).toHaveLength(1);
    expect(result.customers[0]?.name).toBe("John Doe");
    expect(result.total).toBe(1);
  });
});
