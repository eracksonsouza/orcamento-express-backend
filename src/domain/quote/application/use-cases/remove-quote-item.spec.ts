import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { makeCustomer } from "@/src/test/factories/make-customer";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import { CreateQuoteUseCase } from "./create-quote";
import { AddQuoteItemUseCase } from "./add-quote-item";
import { GetQuoteUseCase } from "./get-quote";
import { QuoteItemType } from "../../enterprise/enums/quote-item-type";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import { RemoveQuoteItemUseCase } from "./remove-quote-item";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let removeQuoteItem: RemoveQuoteItemUseCase;
let addQuoteItem: AddQuoteItemUseCase;
let createQuote: CreateQuoteUseCase;
let getQuote: GetQuoteUseCase;

describe("Remove Quote Item", () => {
  beforeEach(() => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    createQuote = new CreateQuoteUseCase(
      inMemoryQuoteRepository,
      inMemoryCustomerRepository,
    );
    removeQuoteItem = new RemoveQuoteItemUseCase(inMemoryQuoteRepository);
    addQuoteItem = new AddQuoteItemUseCase(inMemoryQuoteRepository);
    getQuote = new GetQuoteUseCase(inMemoryQuoteRepository);
  });

  test("should be able to remove a quote item", async () => {
    await inMemoryCustomerRepository.save(
      makeCustomer({ name: "John Doe", email: "john@example.com", phone: "11111111111" }, new UniqueEntityId("customer-123")),
    );

    const { quote: createdQuote } = await createQuote.execute({
      customerId: "customer-123",
    });

    await addQuoteItem.execute({
      quoteId: createdQuote.id.toString(),
      description: "Item 1",
      quantity: 2,
      unitPrice: 50,
      type: QuoteItemType.SERVICE,
    });

    const { quote: quoteBeforeRemoval } = await getQuote.execute({
      quoteId: createdQuote.id.toString(),
    });

    const itemId = quoteBeforeRemoval.items[0]!.id.toString();

    const removeQuoteItemResponse = await removeQuoteItem.execute({
      quoteId: createdQuote.id.toString(),
      itemId,
    });

    const { quote: quoteAfterRemoval } = await getQuote.execute({
      quoteId: createdQuote.id.toString(),
    });

    expect(removeQuoteItemResponse.quoteId).toBe(createdQuote.id.toString());
    expect(quoteAfterRemoval.items).toHaveLength(0);
    expect(quoteAfterRemoval.value).toBe(0);
    expect(quoteAfterRemoval.subtotal).toBe(0);
    expect(quoteAfterRemoval.total).toBe(0);
  });

  test("should throw when quote does not exist", async () => {
    await expect(
      removeQuoteItem.execute({
        quoteId: "non-existent-id",
        itemId: "item-123",
      }),
    ).rejects.toBeInstanceOf(QuoteNotFoundError);
  });
});
