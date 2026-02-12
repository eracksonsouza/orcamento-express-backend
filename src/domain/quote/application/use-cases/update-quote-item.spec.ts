import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { CreateQuoteUseCase } from "./create-quote";
import { AddQuoteItemUseCase } from "./add-quote-item";
import { GetQuoteUseCase } from "./get-quote";
import { UpdateQuoteItemUseCase } from "./update-quote-item";
import { QuoteStatus } from "../../enterprise/enums/quote-status";
import { QuoteItemType } from "../../enterprise/enums/quote-item-type";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import { InvalidQuoteItemError } from "../../enterprise/errors/invalid-quote-item-error";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let createQuote: CreateQuoteUseCase;
let addQuoteItem: AddQuoteItemUseCase;
let updateQuoteItem: UpdateQuoteItemUseCase;
let getQuote: GetQuoteUseCase;

describe("Update Quote Item", () => {
  beforeEach(() => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    createQuote = new CreateQuoteUseCase(inMemoryQuoteRepository);
    addQuoteItem = new AddQuoteItemUseCase(inMemoryQuoteRepository);
    updateQuoteItem = new UpdateQuoteItemUseCase(inMemoryQuoteRepository);
    getQuote = new GetQuoteUseCase(inMemoryQuoteRepository);
  });

  test("should be able to update a quote item", async () => {
    const { quote: createdQuote } = await createQuote.execute({
      customerId: "customer-123",
      value: 0,
      status: QuoteStatus.DRAFT,
      version: 1,
      items: [],
      subtotal: 0,
      total: 0,
    });

    await addQuoteItem.execute({
      quoteId: createdQuote.id.toString(),
      description: "Item original",
      quantity: 2,
      unitPrice: 500,
      type: QuoteItemType.SERVICE,
    });

    const { quote: quoteBeforeUpdate } = await getQuote.execute({
      quoteId: createdQuote.id.toString(),
    });
    const itemId = quoteBeforeUpdate.items[0]!.id.toString();

    const response = await updateQuoteItem.execute({
      quoteId: createdQuote.id.toString(),
      itemId,
      quantity: 3,
      unitPrice: 300,
      type: QuoteItemType.PART,
      description: "Item atualizado",
    });

    const { quote: quoteAfterUpdate } = await getQuote.execute({
      quoteId: createdQuote.id.toString(),
    });
    const updatedItem = quoteAfterUpdate.items[0]!;

    expect(response.quoteId).toBe(createdQuote.id.toString());
    expect(updatedItem.id.toString()).toBe(itemId);
    expect(updatedItem.quantity).toBe(3);
    expect(updatedItem.unitPrice).toBe(300);
    expect(updatedItem.type).toBe(QuoteItemType.PART);
    expect(updatedItem.description).toBe("Item atualizado");
    expect(quoteAfterUpdate.value).toBe(900);
    expect(quoteAfterUpdate.subtotal).toBe(900);
    expect(quoteAfterUpdate.total).toBe(900);
  });

  test("should throw when quote does not exist", async () => {
    await expect(
      updateQuoteItem.execute({
        quoteId: "non-existent-id",
        itemId: "item-1",
        quantity: 1,
        unitPrice: 10,
        type: QuoteItemType.PART,
      }),
    ).rejects.toBeInstanceOf(QuoteNotFoundError);
  });

  test("should throw when quote item does not exist", async () => {
    const { quote: createdQuote } = await createQuote.execute({
      customerId: "customer-123",
      value: 0,
      status: QuoteStatus.DRAFT,
      version: 1,
      items: [],
      subtotal: 0,
      total: 0,
    });

    await expect(
      updateQuoteItem.execute({
        quoteId: createdQuote.id.toString(),
        itemId: "missing-item-id",
        quantity: 1,
        unitPrice: 10,
        type: QuoteItemType.PART,
      }),
    ).rejects.toBeInstanceOf(InvalidQuoteItemError);
  });
});
