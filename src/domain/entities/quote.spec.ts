import { Quote } from "./quote";
import { QuoteItem } from "./quote-item";
import { QuoteStatus } from "./enums/quote-status";
import { QuoteItemType } from "./enums/quote-item-type";
import { UniqueEntityId } from "../../core/entities/unique-entity-id";

const makeItem = (
  unitPrice: number,
  quantity: number,
  id?: string,
): QuoteItem => {
  return QuoteItem.create(
    { unitPrice, quantity, type: QuoteItemType.PART },
    id,
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
});
