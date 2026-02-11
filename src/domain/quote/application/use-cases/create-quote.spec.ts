import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { CreateQuoteUseCase } from "./create-quote";
import { QuoteStatus } from "../../enterprise/enums/quote-status";

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
      value: 1000,
      status: QuoteStatus.DRAFT,
      version: 1,
      items: [],
      subtotal: 1000,
      total: 1000,
    });

    expect(quote.id).toBeTruthy();
    expect(inMemoryQuoteRepository.items[0]?.id).toEqual(quote.id);
  });

  test("should create distinct quote ids for same customer", async () => {
    const first = await sut.execute({
      customerId: "customer-123",
      value: 1000,
      status: QuoteStatus.DRAFT,
      version: 1,
      items: [],
      subtotal: 1000,
      total: 1000,
    });

    const second = await sut.execute({
      customerId: "customer-123",
      value: 500,
      status: QuoteStatus.DRAFT,
      version: 1,
      items: [],
      subtotal: 500,
      total: 500,
    });

    expect(first.quote.id.equals(second.quote.id)).toBe(false);
    expect(inMemoryQuoteRepository.items).toHaveLength(2);
  });
});
