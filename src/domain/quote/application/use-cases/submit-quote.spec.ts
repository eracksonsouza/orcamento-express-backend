import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { CreateCustomerUseCase } from "@/src/domain/customer/application/use-cases/create-customer";
import { AddQuoteItemUseCase } from "./add-quote-item";
import { CreateQuoteUseCase } from "./create-quote";
import { GetQuoteUseCase } from "./get-quote";
import { SubmitQuoteUseCase } from "./submit-quote";
import { QuoteItemType } from "../../enterprise/enums/quote-item-type";
import { QuoteStatus } from "../../enterprise/enums/quote-status";
import { EmptyQuoteError } from "../../enterprise/errors/empty-quote-error";
import { InvalidStatusTransitionError } from "../../enterprise/errors/invalid-status-transition-error";
import { QuoteAlreadySubmittedError } from "../../enterprise/errors/quote-already-submitted-error";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let createCustomer: CreateCustomerUseCase;
let createQuote: CreateQuoteUseCase;
let addQuoteItem: AddQuoteItemUseCase;
let getQuote: GetQuoteUseCase;
let submitQuote: SubmitQuoteUseCase;

describe("Submit Quote", () => {
  beforeEach(async () => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    createCustomer = new CreateCustomerUseCase(inMemoryCustomerRepository);
    createQuote = new CreateQuoteUseCase(
      inMemoryQuoteRepository,
      inMemoryCustomerRepository,
    );
    addQuoteItem = new AddQuoteItemUseCase(inMemoryQuoteRepository);
    getQuote = new GetQuoteUseCase(inMemoryQuoteRepository);
    submitQuote = new SubmitQuoteUseCase(inMemoryQuoteRepository);

    await createCustomer.execute({
      customerId: "customer-123",
      name: "John Doe",
      email: "john@example.com",
      phone: "111111111",
    });
  });

  test("should be able to submit a draft quote with items", async () => {
    const { quote: createdQuote } = await createQuote.execute({
      customerId: "customer-123",
    });

    await addQuoteItem.execute({
      quoteId: createdQuote.id.toString(),
      description: "Item 1",
      quantity: 2,
      unitPrice: 100,
      type: QuoteItemType.SERVICE,
    });

    const response = await submitQuote.execute({
      quoteId: createdQuote.id.toString(),
    });

    const { quote: submittedQuote } = await getQuote.execute({
      quoteId: createdQuote.id.toString(),
    });

    expect(response.quoteId).toBe(createdQuote.id.toString());
    expect(response.status).toBe(QuoteStatus.SUBMITTED);
    expect(response.version).toBe(2);
    expect(submittedQuote.status).toBe(QuoteStatus.SUBMITTED);
    expect(submittedQuote.version).toBe(2);
  });

  test("should throw when quote does not exist", async () => {
    await expect(
      submitQuote.execute({
        quoteId: "non-existent-id",
      }),
    ).rejects.toBeInstanceOf(QuoteNotFoundError);
  });

  test("should throw when quote is empty", async () => {
    const { quote } = await createQuote.execute({
      customerId: "customer-123",
    });

    await expect(
      submitQuote.execute({
        quoteId: quote.id.toString(),
      }),
    ).rejects.toBeInstanceOf(EmptyQuoteError);
  });

  test("should throw when quote is already submitted", async () => {
    const { quote } = await createQuote.execute({
      customerId: "customer-123",
    });

    await addQuoteItem.execute({
      quoteId: quote.id.toString(),
      description: "Item 1",
      quantity: 1,
      unitPrice: 10,
      type: QuoteItemType.PART,
    });

    await submitQuote.execute({
      quoteId: quote.id.toString(),
    });

    await expect(
      submitQuote.execute({
        quoteId: quote.id.toString(),
      }),
    ).rejects.toBeInstanceOf(QuoteAlreadySubmittedError);
  });

  test("should throw when quote status cannot transition to submitted", async () => {
    const { quote } = await createQuote.execute({
      customerId: "customer-123",
    });

    quote.changeStatus(QuoteStatus.SUBMITTED);
    quote.changeStatus(QuoteStatus.GENERATING);
    await inMemoryQuoteRepository.save(quote);

    await expect(
      submitQuote.execute({
        quoteId: quote.id.toString(),
      }),
    ).rejects.toBeInstanceOf(InvalidStatusTransitionError);
  });
});
