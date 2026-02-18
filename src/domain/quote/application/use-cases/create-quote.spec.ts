import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { CreateQuoteUseCase } from "./create-quote";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let sut: CreateQuoteUseCase;

describe("Create Quote", () => {
  beforeEach(() => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    sut = new CreateQuoteUseCase(inMemoryQuoteRepository);
  });

  test("should be able create a quote", async () => {
    const { quote } = await sut.execute({
      customerId: "customer-123",
    });

    expect(quote.id).toBeTruthy();
    expect(inMemoryQuoteRepository.items[0]?.id).toEqual(quote.id);
  });

  test("should create distinct quote ids for same customer", async () => {
    const first = await sut.execute({
      customerId: "customer-123",
    });

    const second = await sut.execute({
      customerId: "customer-123",
    });

    expect(first.quote.id.equals(second.quote.id)).toBe(false);
    expect(inMemoryQuoteRepository.items).toHaveLength(2);
  });
});
