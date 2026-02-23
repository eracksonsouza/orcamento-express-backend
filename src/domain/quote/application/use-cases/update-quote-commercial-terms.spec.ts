import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { CreateCustomerUseCase } from "@/src/domain/customer/application/use-cases/create-customer";
import { CreateQuoteUseCase } from "./create-quote";
import { AddQuoteItemUseCase } from "./add-quote-item";
import { GetQuoteUseCase } from "./get-quote";
import { UpdateQuoteCommercialTermsUseCase } from "./update-quote-commercial-terms";
import { QuoteItemType } from "../../enterprise/enums/quote-item-type";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let createCustomer: CreateCustomerUseCase;
let createQuote: CreateQuoteUseCase;
let addQuoteItem: AddQuoteItemUseCase;
let getQuote: GetQuoteUseCase;
let sut: UpdateQuoteCommercialTermsUseCase;

describe("Update Quote Commercial Terms", () => {
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
    sut = new UpdateQuoteCommercialTermsUseCase(inMemoryQuoteRepository);

    await createCustomer.execute({
      customerId: "customer-123",
      name: "John Doe",
      email: "john@example.com",
      phone: "111111111",
    });
  });

  test("should be able to update quote commercial terms", async () => {
    const { quote } = await createQuote.execute({
      customerId: "customer-123",
    });

    await addQuoteItem.execute({
      quoteId: quote.id.toString(),
      description: "Pintura lateral",
      quantity: 2,
      unitPrice: 100,
      type: QuoteItemType.SERVICE,
    });

    const response = await sut.execute({
      quoteId: quote.id.toString(),
      discount: 20,
      taxes: 10,
      paymentDiscount: 5,
      paymentMethod: "PIX",
    });

    const { quote: updatedQuote } = await getQuote.execute({
      quoteId: quote.id.toString(),
    });

    expect(response.quoteId).toBe(quote.id.toString());
    expect(updatedQuote.discount).toBe(20);
    expect(updatedQuote.taxes).toBe(10);
    expect(updatedQuote.paymentDiscount).toBe(5);
    expect(updatedQuote.paymentMethod).toBe("PIX");
    expect(updatedQuote.subtotal).toBe(200);
    expect(updatedQuote.total).toBe(185);
    expect(updatedQuote.value).toBe(185);
  });

  test("should throw when quote does not exist", async () => {
    await expect(
      sut.execute({
        quoteId: "non-existent-id",
        discount: 10,
      }),
    ).rejects.toBeInstanceOf(QuoteNotFoundError);
  });
});
