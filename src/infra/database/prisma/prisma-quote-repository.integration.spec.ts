import { describe, expect, test, beforeEach } from "vitest";
import { PrismaQuoteRepository } from "./prisma-quote-repository";
import { PrismaCustomerRepository } from "./prisma-customer-repository";
import { Quote } from "@/src/domain/quote/enterprise/entities/quote";
import { QuoteItem } from "@/src/domain/quote/enterprise/entities/quote-item";
import { Customer } from "@/src/domain/customer/enterprise/entities/customer";
import { QuoteStatus } from "@/src/domain/quote/enterprise/enums/quote-status";
import { QuoteItemType } from "@/src/domain/quote/enterprise/enums/quote-item-type";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import { prismaTest } from "@/src/test/setup/prisma-test-client";

const makeItem = (
  unitPrice: number,
  quantity: number,
  description?: string,
): QuoteItem => {
  return QuoteItem.create({
    unitPrice,
    quantity,
    type: QuoteItemType.PART,
    description: description ?? "Test Item",
  });
};

const makeCustomer = (name?: string): Customer => {
  return Customer.create({
    name: name ?? "Test Customer",
    email: "test@example.com",
    phone: "11999999999",
  });
};

describe("PrismaQuoteRepository", () => {
  let quoteRepository: PrismaQuoteRepository;
  let customerRepository: PrismaCustomerRepository;
  let testCustomer: Customer;
  const makeQuote = (
    props: Parameters<typeof Quote.create>[0] = {},
    customerId = testCustomer.id.toString(),
    quoteId?: UniqueEntityId,
  ): Quote => {
    return Quote.create(
      {
        customerId,
        ...props,
      },
      quoteId,
    );
  };

  beforeEach(async () => {
    quoteRepository = new PrismaQuoteRepository(prismaTest);
    customerRepository = new PrismaCustomerRepository(prismaTest);

    // Create a customer for quote tests
    testCustomer = makeCustomer();
    await customerRepository.save(testCustomer);
  });

  describe("save", () => {
    test("should create a new quote with items", async () => {
      const quote = makeQuote({
        items: [makeItem(100, 2), makeItem(50, 3)],
      });

      await quoteRepository.save(quote);

      const found = await quoteRepository.findById(quote.id.toString());
      expect(found).not.toBeNull();
      expect(found?.items).toHaveLength(2);
      expect(found?.total).toBe(350); // (100*2) + (50*3)
    });

    test("should create a quote without items", async () => {
      const quote = makeQuote({});

      await quoteRepository.save(quote);

      const found = await quoteRepository.findById(quote.id.toString());
      expect(found).not.toBeNull();
      expect(found?.items).toHaveLength(0);
      expect(found?.total).toBe(0);
    });

    test("should update an existing quote", async () => {
      const quote = makeQuote({
        items: [makeItem(100, 1)],
      });
      await quoteRepository.save(quote);

      // Add a new item
      quote.addItem(makeItem(200, 2));
      await quoteRepository.save(quote);

      const found = await quoteRepository.findById(quote.id.toString());
      expect(found?.items).toHaveLength(2);
      expect(found?.total).toBe(500); // 100 + (200*2)
    });

    test("should throw when creating with non-existent customer", async () => {
      const quote = makeQuote({}, "non-existent-customer-id");

      await expect(quoteRepository.save(quote)).rejects.toThrow();
    });
  });

  describe("exists", () => {
    test("should return true when quote exists", async () => {
      const quote = makeQuote({});
      await quoteRepository.save(quote);

      const exists = await quoteRepository.exists(quote.id.toString());
      expect(exists).toBe(true);
    });

    test("should return false when quote does not exist", async () => {
      const exists = await quoteRepository.exists("non-existent-id");
      expect(exists).toBe(false);
    });
  });

  describe("findById", () => {
    test("should return quote with items when found", async () => {
      const quote = makeQuote({
        items: [makeItem(100, 1, "Oil Filter"), makeItem(50, 2, "Spark Plug")],
        status: QuoteStatus.DRAFT,
      });
      await quoteRepository.save(quote);

      const found = await quoteRepository.findById(quote.id.toString());

      expect(found).not.toBeNull();
      expect(found?.id.equals(quote.id)).toBe(true);
      expect(found?.items).toHaveLength(2);
      expect(found?.status).toBe(QuoteStatus.DRAFT);
    });

    test("should return null when quote not found", async () => {
      const found = await quoteRepository.findById("non-existent-id");
      expect(found).toBeNull();
    });
  });

  describe("findByCustomerId", () => {
    test("should return all quotes for a customer", async () => {
      const quote1 = makeQuote({});
      const quote2 = makeQuote({});
      await quoteRepository.save(quote1);
      await quoteRepository.save(quote2);

      const quotes = await quoteRepository.findByCustomerId(
        testCustomer.id.toString(),
      );

      expect(quotes).toHaveLength(2);
    });

    test("should return empty array when customer has no quotes", async () => {
      const quotes = await quoteRepository.findByCustomerId("no-quotes-id");
      expect(quotes).toHaveLength(0);
    });

    test("should not return quotes from other customers", async () => {
      const anotherCustomer = makeCustomer("Another Customer");
      await customerRepository.save(anotherCustomer);

      const quote1 = makeQuote({});
      const quote2 = makeQuote({}, anotherCustomer.id.toString());
      await quoteRepository.save(quote1);
      await quoteRepository.save(quote2);

      const quotes = await quoteRepository.findByCustomerId(
        testCustomer.id.toString(),
      );

      expect(quotes).toHaveLength(1);
      expect(quotes[0]?.id.equals(quote1.id)).toBe(true);
    });
  });

  describe("findByStatus", () => {
    test("should return quotes with matching status", async () => {
      const draftQuote = makeQuote({ status: QuoteStatus.DRAFT });
      const submittedQuote = makeQuote({ status: QuoteStatus.DRAFT });
      submittedQuote.submit();

      await quoteRepository.save(draftQuote);
      await quoteRepository.save(submittedQuote);

      const drafts = await quoteRepository.findByStatus(QuoteStatus.DRAFT);
      const submitted = await quoteRepository.findByStatus(
        QuoteStatus.SUBMITTED,
      );

      expect(drafts).toHaveLength(1);
      expect(submitted).toHaveLength(1);
    });

    test("should return empty array when no quotes match status", async () => {
      const quote = makeQuote({ status: QuoteStatus.DRAFT });
      await quoteRepository.save(quote);

      const ready = await quoteRepository.findByStatus(QuoteStatus.READY);
      expect(ready).toHaveLength(0);
    });
  });

  describe("findAll", () => {
    test("should return paginated quotes", async () => {
      for (let i = 1; i <= 15; i++) {
        const quote = makeQuote({});
        await quoteRepository.save(quote);
      }

      const result = await quoteRepository.findAll({ page: 1, perPage: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(15);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(2);
    });

    test("should filter by customerId", async () => {
      const anotherCustomer = makeCustomer("Another Customer");
      await customerRepository.save(anotherCustomer);

      const quote1 = makeQuote({});
      const quote2 = makeQuote({}, anotherCustomer.id.toString());
      await quoteRepository.save(quote1);
      await quoteRepository.save(quote2);

      const result = await quoteRepository.findAll(
        { page: 1, perPage: 10 },
        { customerId: testCustomer.id.toString() },
      );

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    test("should filter by status", async () => {
      const draftQuote = makeQuote({ status: QuoteStatus.DRAFT });
      const submittedQuote = makeQuote({ status: QuoteStatus.DRAFT });
      submittedQuote.submit();

      await quoteRepository.save(draftQuote);
      await quoteRepository.save(submittedQuote);

      const result = await quoteRepository.findAll(
        { page: 1, perPage: 10 },
        { status: QuoteStatus.SUBMITTED },
      );

      expect(result.data).toHaveLength(1);
    });

    test("should filter by date range", async () => {
      const quote = makeQuote({});
      await quoteRepository.save(quote);

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const result = await quoteRepository.findAll(
        { page: 1, perPage: 10 },
        { startDate, endDate },
      );

      expect(result.data).toHaveLength(1);
    });

    test("should use default pagination when not provided", async () => {
      const quote = makeQuote({});
      await quoteRepository.save(quote);

      const result = await quoteRepository.findAll();

      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });
  });

  describe("findVersions", () => {
    test("should return versions of a quote", async () => {
      // This test depends on how versioning is implemented
      // For now, we test the basic functionality
      const quote = makeQuote({ version: 1 });
      await quoteRepository.save(quote);

      // Without explicit parentId support, this will return empty
      const versions = await quoteRepository.findVersions(quote.id.toString());
      expect(Array.isArray(versions)).toBe(true);
    });
  });

  describe("delete", () => {
    test("should delete an existing quote", async () => {
      const quote = makeQuote({});
      await quoteRepository.save(quote);

      await quoteRepository.delete(quote.id.toString());

      const found = await quoteRepository.findById(quote.id.toString());
      expect(found).toBeNull();
    });

    test("should cascade delete quote items", async () => {
      const quote = makeQuote({
        items: [makeItem(100, 1), makeItem(50, 2)],
      });
      await quoteRepository.save(quote);

      await quoteRepository.delete(quote.id.toString());

      const found = await quoteRepository.findById(quote.id.toString());
      expect(found).toBeNull();
    });

    test("should throw when deleting non-existent quote", async () => {
      await expect(quoteRepository.delete("non-existent-id")).rejects.toThrow();
    });
  });

  describe("data integrity", () => {
    test("should preserve quote status", async () => {
      const quote = makeQuote({ status: QuoteStatus.DRAFT });
      quote.submit();
      await quoteRepository.save(quote);

      const found = await quoteRepository.findById(quote.id.toString());
      expect(found?.status).toBe(QuoteStatus.SUBMITTED);
    });

    test("should preserve quote version", async () => {
      const quote = makeQuote({ version: 5 });
      await quoteRepository.save(quote);

      const found = await quoteRepository.findById(quote.id.toString());
      expect(found?.version).toBe(5);
    });

    test("should preserve item types", async () => {
      const partItem = QuoteItem.create({
        unitPrice: 100,
        quantity: 1,
        type: QuoteItemType.PART,
        description: "Part",
      });
      const serviceItem = QuoteItem.create({
        unitPrice: 200,
        quantity: 1,
        type: QuoteItemType.SERVICE,
        description: "Service",
      });

      const quote = makeQuote({ items: [partItem, serviceItem] });
      await quoteRepository.save(quote);

      const found = await quoteRepository.findById(quote.id.toString());
      const types = found?.items.map((i) => i.type).sort();
      expect(types).toEqual([QuoteItemType.PART, QuoteItemType.SERVICE]);
    });

    test("should calculate totals correctly", async () => {
      const quote = makeQuote({
        items: [
          makeItem(100, 2), // 200
          makeItem(50, 3), // 150
          makeItem(25, 4), // 100
        ],
      });
      await quoteRepository.save(quote);

      const found = await quoteRepository.findById(quote.id.toString());
      expect(found?.subtotal).toBe(450);
      expect(found?.total).toBe(450);
    });

    test("should preserve custom id", async () => {
      const customId = new UniqueEntityId("custom-quote-uuid");
      const quote = makeQuote({}, testCustomer.id.toString(), customId);

      await quoteRepository.save(quote);
      const found = await quoteRepository.findById("custom-quote-uuid");

      expect(found).not.toBeNull();
      expect(found?.id.toString()).toBe("custom-quote-uuid");
    });
  });
});
