import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { CreateQuoteUseCase } from "./create-quote";
import { AddQuoteItemUseCase } from "./add-quote-item";
import { GetQuoteUseCase } from "./get-quote";
import { QuoteStatus } from "../../enterprise/enums/quote-status";
import { QuoteItemType } from "../../enterprise/enums/quote-item-type";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let createQuote: CreateQuoteUseCase;
let addQuoteItem: AddQuoteItemUseCase;
let sut: GetQuoteUseCase;

describe("Add Quote Item", () => {
  beforeEach(() => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    createQuote = new CreateQuoteUseCase(inMemoryQuoteRepository);
    addQuoteItem = new AddQuoteItemUseCase(inMemoryQuoteRepository);
    sut = new GetQuoteUseCase(inMemoryQuoteRepository);
  });

  test("should be able to add a quote item", async () => {
    const { quote: createdQuote } = await createQuote.execute({
      customerId: "customer-123",
      value: 1000,
      status: QuoteStatus.DRAFT,
      version: 1,
      items: [],
      subtotal: 0,
      total: 0,
    });

    await addQuoteItem.execute({
      quoteId: createdQuote.id.toString(),
      description: "Item 1",
      quantity: 2,
      unitPrice: 500,
      type: QuoteItemType.SERVICE,
    });

    const { quote } = await sut.execute({
      quoteId: createdQuote.id.toString(),
    });

    expect(quote.items).toHaveLength(1);
    expect(quote.value).toBe(1000);
  });

  test("should throw when quote does not exist", async () => {
    await expect(
      addQuoteItem.execute({
        quoteId: "non-existent-id",
        description: "Item 1",
        quantity: 1,
        unitPrice: 10,
        type: QuoteItemType.PART,
      }),
    ).rejects.toBeInstanceOf(QuoteNotFoundError);
  });
});
