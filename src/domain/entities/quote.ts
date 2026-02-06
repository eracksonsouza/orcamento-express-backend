import { Entity } from "./entity.js";
import { UniqueEntityId } from "./unique-entity-id.js";
import {
  QuoteStatus,
  isValidStatusTransition,
  isEditableStatus,
} from "./enums/quote-status.js";
import { QuoteItem } from "./quote-item.js";
import { calculateQuoteTotals } from "../../shared/utils/quote/calculate-totals.js";

export interface QuoteProps {
  value: number;
  description?: string | null;
  status: QuoteStatus;
  version: number;
  items: QuoteItem[];
  subtotal: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Quote extends Entity<QuoteProps> {
  get value(): number {
    return this.props.value;
  }

  get status(): QuoteStatus {
    return this.props.status;
  }

  get version(): number {
    return this.props.version;
  }

  get items(): QuoteItem[] {
    return this.props.items;
  }

  get subtotal(): number {
    return this.props.subtotal;
  }

  get total(): number {
    return this.props.total;
  }

  get description(): string | null | undefined {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  updateValue(value: number): void {
    this.assertEditable();
    this.props.value = value;
    this.touch();
  }

  updateDescription(description: string | null): void {
    this.assertEditable();
    this.props.description = description;
    this.touch();
  }

  addItem(item: QuoteItem): void {
    this.assertEditable();
    this.props.items.push(item);
    this.recalculateTotals();
    this.touch();
  }

  removeItem(itemId: UniqueEntityId | string): void {
    this.assertEditable();
    const targetId = typeof itemId === "string" ? itemId : itemId.toString();
    this.props.items = this.props.items.filter(
      (item) => item.id.toString() !== targetId,
    );
    this.recalculateTotals();
    this.touch();
  }

  submit(): void {
    this.changeStatus(QuoteStatus.SUBMITTED);
    this.incrementVersion();
  }

  changeStatus(to: QuoteStatus): void {
    if (!isValidStatusTransition(this.props.status, to)) {
      throw new Error(
        `Invalid status transition from ${this.props.status} to ${to}`,
      );
    }
    this.props.status = to;
    this.touch();
  }

  cloneNextVersion(): Quote {
    return new Quote({
      ...this.props,
      items: [...this.props.items],
      version: this.props.version + 1,
      status: QuoteStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private incrementVersion(): void {
    this.props.version += 1;
  }

  private recalculateTotals(): void {
    const totals = calculateQuoteTotals(this.props.items);
    this.props.subtotal = totals.subtotal;
    this.props.total = totals.total;
    this.props.value = totals.value;
  }

  private assertEditable(): void {
    if (!isEditableStatus(this.props.status)) {
      throw new Error("Quote is immutable after file generation starts");
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Partial<QuoteProps> & { value?: number },
    id?: UniqueEntityId | string,
  ): Quote {
    const resolvedId = typeof id === "string" ? new UniqueEntityId(id) : id;
    const quote = new Quote(
      {
        value: props.value ?? 0,
        description: props.description ?? null,
        status: props.status ?? QuoteStatus.DRAFT,
        version: props.version ?? 1,
        items: props.items ?? [],
        subtotal: props.subtotal ?? 0,
        total: props.total ?? 0,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      resolvedId,
    );
    quote.recalculateTotals();
    return quote;
  }
}
