import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { CreateCustomerUseCase } from "@/src/domain/customer/application/use-cases/create-customer";
import { CreateQuoteUseCase } from "./create-quote";
import { AddQuoteItemUseCase } from "./add-quote-item";
import { GetQuoteUseCase } from "./get-quote";
import { QuoteItemType } from "../../enterprise/enums/quote-item-type";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let createCustomer: CreateCustomerUseCase;
let createQuote: CreateQuoteUseCase;
let addQuoteItem: AddQuoteItemUseCase;
let sut: GetQuoteUseCase;

describe("Add Quote Item", () => {
  beforeEach(() => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    createCustomer = new CreateCustomerUseCase(inMemoryCustomerRepository);
    createQuote = new CreateQuoteUseCase(
      inMemoryQuoteRepository,
      inMemoryCustomerRepository,
    );
    addQuoteItem = new AddQuoteItemUseCase(inMemoryQuoteRepository);
    sut = new GetQuoteUseCase(inMemoryQuoteRepository);
  });

  test("should be able to add a quote item", async () => {
    await createCustomer.execute({
      customerId: "customer-123",
      name: "John Doe",
      email: "john@example.com",
      phone: "111111111",
    });

    const { quote: createdQuote } = await createQuote.execute({
      customerId: "customer-123",
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
