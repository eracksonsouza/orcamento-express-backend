import { Quote } from "./quote";
import { QuoteItem } from "./quote-item";
import { QuoteStatus } from "@/src/domain/quote/enterprise/enums/quote-status";
import { QuoteItemType } from "@/src/domain/quote/enterprise/enums/quote-item-type";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";

const makeItem = (
  unitPrice: number,
  quantity: number,
  id?: string,
): QuoteItem => {
  return QuoteItem.create(
    { unitPrice, quantity, type: QuoteItemType.PART },
    id ? new UniqueEntityId(id) : undefined,
  );
};

describe("Quote Entity", () => {
  test("recalculates totals when items are added or removed", () => {
    const quote = Quote.create({
      items: [makeItem(100, 1), makeItem(50, 2)],
    });

    expect(quote.subtotal).toBe(200);
    expect(quote.total).toBe(200);
    expect(quote.value).toBe(200);

    quote.addItem(makeItem(25, 4)); // +100
    expect(quote.total).toBe(300);

    const removable = quote.items[1]!; // 50 * 2
    quote.removeItem(removable.id);
    expect(quote.total).toBe(200); // 100 + 100
    expect(quote.items).toHaveLength(2);
  });

  test("removes the right item by id and touches updatedAt", () => {
    vi.useFakeTimers();
    const initialTime = new Date("2026-02-06T10:00:00Z");
    const afterRemoval = new Date("2026-02-06T11:00:00Z");
    vi.setSystemTime(initialTime);

    const targetId = new UniqueEntityId("item-to-remove");
    const quote = Quote.create({
      items: [makeItem(10, 1, "keep"), makeItem(20, 1, targetId.toString())],
    });

    vi.setSystemTime(afterRemoval);
    quote.removeItem(targetId);

    expect(quote.items.map((i) => i.id.toString())).toEqual(["keep"]);
    expect(quote.updatedAt).toEqual(afterRemoval);
    vi.useRealTimers();
  });

  test("updates description only when status is editable", () => {
    const quote = Quote.create({
      description: null,
      status: QuoteStatus.DRAFT,
    });

    quote.updateDescription("New desc");
    expect(quote.description).toBe("New desc");

    quote.changeStatus(QuoteStatus.SUBMITTED); // still editable
    quote.updateDescription("Still editable");
    expect(quote.description).toBe("Still editable");

    quote.changeStatus(QuoteStatus.GENERATING); // still editable
    quote.updateDescription("Generating desc");
    expect(quote.description).toBe("Generating desc");

    quote.changeStatus(QuoteStatus.READY); // now immutable
    expect(() => quote.updateDescription("Should fail")).toThrow(
      "Quote is immutable after file generation starts",
    );
  });

  test("submit increments version and changes status", () => {
    vi.useFakeTimers();
    const now = new Date("2026-02-06T09:00:00Z");
    vi.setSystemTime(now);

    const quote = Quote.create({ version: 3 });
    expect(quote.status).toBe(QuoteStatus.DRAFT);
    expect(quote.version).toBe(3);

    const afterSubmit = new Date("2026-02-06T09:05:00Z");
    vi.setSystemTime(afterSubmit);
    quote.submit();

    expect(quote.status).toBe(QuoteStatus.SUBMITTED);
    expect(quote.version).toBe(4);
    expect(quote.updatedAt).toEqual(afterSubmit);
    vi.useRealTimers();
  });

  test("validates status transitions", () => {
    const quote = Quote.create({ status: QuoteStatus.DRAFT });

    quote.changeStatus(QuoteStatus.SUBMITTED); // valid
    expect(quote.status).toBe(QuoteStatus.SUBMITTED);

    expect(() => quote.changeStatus(QuoteStatus.READY)).toThrow(
      "Invalid status transition from SUBMITTED to READY",
    );

    quote.changeStatus(QuoteStatus.GENERATING); // valid
    expect(quote.status).toBe(QuoteStatus.GENERATING);
  });

  test("cloneNextVersion creates a new draft with version + 1 and new identity", () => {
    const baseItems = [makeItem(15, 2)];
    const original = Quote.create({
      version: 2,
      status: QuoteStatus.SUBMITTED,
      items: baseItems,
    });

    const cloned = original.cloneNextVersion();

    expect(cloned.id.equals(original.id)).toBe(false);
    expect(cloned.version).toBe(3);
    expect(cloned.status).toBe(QuoteStatus.DRAFT);
    expect(cloned.items).toHaveLength(1);
    expect(cloned.items).not.toBe(original.items); // shallow copy of array
    expect(cloned.items[0]).toBe(original.items[0]); // same items reused
  });

  test("assigns vehicle only when vehicle belongs to quote customer", () => {
    const quote = Quote.create({
      customerId: "customer-1",
    });

    quote.assignVehicle("vehicle-1", "customer-1");
    expect(quote.vehicleId).toBe("vehicle-1");

    expect(() => quote.assignVehicle("vehicle-2", "customer-2")).toThrow(
      "Vehicle does not belong to quote customer",
    );
  });

  test("updates commercial terms and recalculates totals", () => {
    const quote = Quote.create({
      items: [makeItem(100, 2)], // 200
    });

    quote.updateCommercialTerms({
      discount: 20,
      taxes: 10,
      paymentDiscount: 5,
      paymentMethod: "PIX",
    });

    expect(quote.discount).toBe(20);
    expect(quote.taxes).toBe(10);
    expect(quote.paymentDiscount).toBe(5);
    expect(quote.paymentMethod).toBe("PIX");
    expect(quote.subtotal).toBe(200);
    expect(quote.total).toBe(185); // 200 - 20 - 5 + 10
    expect(quote.value).toBe(185);
  });

  test("combines item discounts/taxes with quote commercial terms", () => {
    const quote = Quote.create({
      items: [
        QuoteItem.create({
          unitPrice: 100,
          quantity: 2,
          discount: 20,
          taxes: 5,
          type: QuoteItemType.SERVICE,
          serviceCategory: "PINTURA",
        }), // bruto 200, liquido item 185
        QuoteItem.create({
          unitPrice: 50,
          quantity: 1,
          type: QuoteItemType.PART,
        }), // bruto 50, liquido item 50
      ],
    });

    quote.updateCommercialTerms({
      discount: 10,
      taxes: 5,
      paymentDiscount: 5,
      paymentMethod: "PIX",
    });

    expect(quote.subtotal).toBe(250); // soma bruta dos itens
    expect(quote.total).toBe(225); // (185 + 50) - 10 - 5 + 5
    expect(quote.value).toBe(225);
    expect(quote.paymentMethod).toBe("PIX");
  });
});
