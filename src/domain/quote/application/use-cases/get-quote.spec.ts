import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { CreateQuoteUseCase } from "./create-quote";
import { GetQuoteUseCase } from "./get-quote";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let createQuote: CreateQuoteUseCase;
let sut: GetQuoteUseCase;

describe("Get Quote", () => {
  beforeEach(() => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    createQuote = new CreateQuoteUseCase(inMemoryQuoteRepository);
    sut = new GetQuoteUseCase(inMemoryQuoteRepository);
  });

  test("should be able to get a quote by id", async () => {
    const { quote: createdQuote } = await createQuote.execute({
      customerId: "customer-123",
    });

    const { quote } = await sut.execute({
      quoteId: createdQuote.id.toString(),
    });

    expect(quote.id).toEqual(createdQuote.id);
  });

  test("should throw when quote does not exist", async () => {
    await expect(
      sut.execute({
        quoteId: "non-existent-id",
      }),
    ).rejects.toBeInstanceOf(QuoteNotFoundError);
  });
});
