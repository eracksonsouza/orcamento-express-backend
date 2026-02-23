import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { CreateCustomerUseCase } from "@/src/domain/customer/application/use-cases/create-customer";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import { QuoteStatus } from "../../enterprise/enums/quote-status";
import { QuoteItemType } from "../../enterprise/enums/quote-item-type";
import { AddQuoteItemUseCase } from "./add-quote-item";
import { CreateNewQuoteVersionUseCase } from "./create-new-quote-version";
import { CreateQuoteUseCase } from "./create-quote";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let createCustomer: CreateCustomerUseCase;
let createQuote: CreateQuoteUseCase;
let addQuoteItem: AddQuoteItemUseCase;
let sut: CreateNewQuoteVersionUseCase;

describe("Create New Quote Version", () => {
  beforeEach(() => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    createCustomer = new CreateCustomerUseCase(inMemoryCustomerRepository);
    createQuote = new CreateQuoteUseCase(
      inMemoryQuoteRepository,
      inMemoryCustomerRepository,
    );
    addQuoteItem = new AddQuoteItemUseCase(inMemoryQuoteRepository);
    sut = new CreateNewQuoteVersionUseCase(inMemoryQuoteRepository);
  });

  test("should be able to create a new quote version", async () => {
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
      description: "Service item",
      quantity: 2,
      unitPrice: 100,
      type: QuoteItemType.SERVICE,
    });

    createdQuote.changeStatus(QuoteStatus.SUBMITTED);
    await inMemoryQuoteRepository.save(createdQuote);

    const { quote: newQuoteVersion } = await sut.execute({
      quoteId: createdQuote.id.toString(),
    });

    expect(newQuoteVersion.id.equals(createdQuote.id)).toBe(false);
    expect(newQuoteVersion.version).toBe(2);
    expect(newQuoteVersion.status).toBe(QuoteStatus.DRAFT);
    expect(newQuoteVersion.items).toHaveLength(1);
    expect(inMemoryQuoteRepository.items).toHaveLength(2);
  });

  test("should throw when quote does not exist", async () => {
    await expect(
      sut.execute({
        quoteId: "non-existent-id",
      }),
    ).rejects.toBeInstanceOf(QuoteNotFoundError);
  });
});
