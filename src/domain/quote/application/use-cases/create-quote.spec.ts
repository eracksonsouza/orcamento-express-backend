import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { CustomerNotFoundError } from "@/src/domain/customer/enterprise/errors/customer-not-found-error";
import { makeCustomer } from "@/src/test/factories/make-customer";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import { CreateQuoteUseCase } from "./create-quote";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let sut: CreateQuoteUseCase;

describe("Create Quote", () => {
  beforeEach(() => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    sut = new CreateQuoteUseCase(
      inMemoryQuoteRepository,
      inMemoryCustomerRepository,
    );
  });

  test("should be able create a quote", async () => {
    await inMemoryCustomerRepository.save(
      makeCustomer({ name: "John Doe", email: "john@example.com", phone: "11111111111" }, new UniqueEntityId("customer-123")),
    );

    const { quote } = await sut.execute({
      customerId: "customer-123",
    });

    expect(quote.id).toBeTruthy();
    expect(inMemoryQuoteRepository.items[0]?.id).toEqual(quote.id);
  });

  test("should create distinct quote ids for same customer", async () => {
    await inMemoryCustomerRepository.save(
      makeCustomer({ name: "John Doe", email: "john@example.com", phone: "11111111111" }, new UniqueEntityId("customer-123")),
    );

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
