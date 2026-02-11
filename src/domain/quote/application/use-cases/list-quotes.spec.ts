import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { CreateQuoteUseCase } from "./create-quote";
import { QuoteStatus } from "../../enterprise/enums/quote-status";
import { ListQuotesUseCase } from "./list-quotes";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let createQuote: CreateQuoteUseCase;
let listQuotes: ListQuotesUseCase;

describe("List quotes", () => {
  beforeEach(() => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    createQuote = new CreateQuoteUseCase(inMemoryQuoteRepository);
    listQuotes = new ListQuotesUseCase(inMemoryQuoteRepository);
  });

  async function createQuoteFixture(
    customerId: string,
    status: QuoteStatus = QuoteStatus.DRAFT,
  ): Promise<void> {
    await createQuote.execute({
      customerId,
      value: 0,
      status,
      version: 1,
      items: [],
      subtotal: 0,
      total: 0,
    });
  }

  test("should return empty list when no quotes exist", async () => {
    const result = await listQuotes.execute();

    expect(result.quotes).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(10);
    expect(result.totalPages).toBe(0);
  });

  test("should use default pagination values", async () => {
    const result = await listQuotes.execute();

    expect(result.page).toBe(1);
    expect(result.perPage).toBe(10);
  });

  test("should be able to list quotes", async () => {
    await createQuoteFixture("customer-1");
    await createQuoteFixture("customer-2");
    await createQuoteFixture("customer-3");

    const result = await listQuotes.execute();

    expect(result.quotes).toHaveLength(3);
    expect(result.total).toBe(3);
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  test("should be able to list quotes with pagination", async () => {
    for (let i = 1; i <= 25; i++) {
      await createQuoteFixture(`customer-${i}`);
    }

    const result = await listQuotes.execute({ page: 2, perPage: 10 });

    expect(result.quotes).toHaveLength(10);
    expect(result.total).toBe(25);
    expect(result.page).toBe(2);
    expect(result.perPage).toBe(10);
    expect(result.totalPages).toBe(3);
  });

  test("should return last page with remaining items", async () => {
    for (let i = 1; i <= 25; i++) {
      await createQuoteFixture(`customer-${i}`);
    }

    const result = await listQuotes.execute({ page: 3, perPage: 10 });

    expect(result.quotes).toHaveLength(5);
    expect(result.page).toBe(3);
  });

  test("should handle custom perPage value", async () => {
    for (let i = 1; i <= 15; i++) {
      await createQuoteFixture(`customer-${i}`);
    }

    const result = await listQuotes.execute({ perPage: 5 });

    expect(result.quotes).toHaveLength(5);
    expect(result.totalPages).toBe(3);
  });

  test("should search quotes by customerId query", async () => {
    await createQuoteFixture("acme-01");
    await createQuoteFixture("acme-02");
    await createQuoteFixture("globex-01");

    const result = await listQuotes.execute({ query: "acme" });

    expect(result.quotes).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  test("should filter quotes by status", async () => {
    await createQuoteFixture("customer-draft", QuoteStatus.DRAFT);
    await createQuoteFixture("customer-submitted", QuoteStatus.SUBMITTED);

    const result = await listQuotes.execute({ status: QuoteStatus.SUBMITTED });

    expect(result.quotes).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.quotes[0]?.status).toBe(QuoteStatus.SUBMITTED);
  });
});
