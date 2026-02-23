import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { CustomerNotFoundError } from "@/src/domain/customer/enterprise/errors/customer-not-found-error";
import { CreateCustomerUseCase } from "@/src/domain/customer/application/use-cases/create-customer";
import { CreateQuoteUseCase } from "./create-quote";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let createCustomer: CreateCustomerUseCase;
let sut: CreateQuoteUseCase;

describe("Create Quote", () => {
  beforeEach(() => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    createCustomer = new CreateCustomerUseCase(inMemoryCustomerRepository);
    sut = new CreateQuoteUseCase(
      inMemoryQuoteRepository,
      inMemoryCustomerRepository,
    );
  });

  test("should be able create a quote", async () => {
    await createCustomer.execute({
      customerId: "customer-123",
      name: "John Doe",
      email: "john@example.com",
      phone: "111111111",
    });

    const { quote } = await sut.execute({
      customerId: "customer-123",
    });

    expect(quote.id).toBeTruthy();
    expect(inMemoryQuoteRepository.items[0]?.id).toEqual(quote.id);
  });

  test("should create distinct quote ids for same customer", async () => {
    await createCustomer.execute({
      customerId: "customer-123",
      name: "John Doe",
      email: "john@example.com",
      phone: "111111111",
    });

    const first = await sut.execute({
      customerId: "customer-123",
    });

    const second = await sut.execute({
      customerId: "customer-123",
    });

    expect(first.quote.id.equals(second.quote.id)).toBe(false);
    expect(inMemoryQuoteRepository.items).toHaveLength(2);
  });

  test("should throw when customer does not exist", async () => {
    await expect(
      sut.execute({
        customerId: "non-existent-customer",
      }),
    ).rejects.toBeInstanceOf(CustomerNotFoundError);
  });
});
