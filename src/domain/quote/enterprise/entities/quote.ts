import { Entity } from "@/src/core/entities/entity";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import {
  QuoteStatus,
  isValidStatusTransition,
  isEditableStatus,
} from "@/src/domain/quote/enterprise/enums/quote-status";
import type { QuoteItemType } from "@/src/domain/quote/enterprise/enums/quote-item-type";
import { InvalidQuoteItemError } from "@/src/domain/quote/enterprise/errors/invalid-quote-item-error";
import { QuoteItem } from "./quote-item";
import { calculateQuoteTotals } from "@/src/shared/utils/quote/calculate-totals";

export type QuotePaymentMethod =
  | "UNSPECIFIED"
  | "CASH"
  | "PIX"
  | "CARD"
  | "BANK_TRANSFER";

const QUOTE_PAYMENT_METHODS: QuotePaymentMethod[] = [
  "UNSPECIFIED",
  "CASH",
  "PIX",
  "CARD",
  "BANK_TRANSFER",
];

export interface QuoteProps {
  value: number;
  description?: string | null;
  customerId: string;
  vehicleId?: string | null;
  status: QuoteStatus;
  version: number;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  taxes: number;
  paymentDiscount: number;
  paymentMethod: QuotePaymentMethod;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UpdateQuoteItemProps {
  unitPrice: number;
  quantity: number;
  type: QuoteItemType;
  description?: string | null;
}

interface UpdateQuoteCommercialTermsProps {
  discount?: number;
  taxes?: number;
  paymentDiscount?: number;
  paymentMethod?: QuotePaymentMethod;
}

export class Quote extends Entity<QuoteProps> {
  get customerId(): string {
    return this.props.customerId;
  }
  get value(): number {
    return this.props.value;
  }

  get status(): QuoteStatus {
    return this.props.status;
  }

  get vehicleId(): string | null | undefined {
    return this.props.vehicleId;
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

  get discount(): number {
    return this.props.discount;
  }

  get taxes(): number {
    return this.props.taxes;
  }

  get paymentDiscount(): number {
    return this.props.paymentDiscount;
  }

  get paymentMethod(): QuotePaymentMethod {
    return this.props.paymentMethod;
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

  assignVehicle(vehicleId: string, vehicleCustomerId: string): void {
    this.assertEditable();

    if (vehicleCustomerId !== this.props.customerId) {
      throw new Error("Vehicle does not belong to quote customer");
    }

    this.props.vehicleId = vehicleId;
    this.touch();
  }

  unassignVehicle(): void {
    this.assertEditable();
    this.props.vehicleId = null;
    this.touch();
  }

  updateCommercialTerms({
    discount,
    taxes,
    paymentDiscount,
    paymentMethod,
  }: UpdateQuoteCommercialTermsProps): void {
    this.assertEditable();

    if (discount !== undefined) {
      this.assertNonNegative(discount, "Discount");
      this.props.discount = discount;
    }

    if (taxes !== undefined) {
      this.assertNonNegative(taxes, "Taxes");
      this.props.taxes = taxes;
    }

    if (paymentDiscount !== undefined) {
      this.assertNonNegative(paymentDiscount, "Payment discount");
      this.props.paymentDiscount = paymentDiscount;
    }

    if (paymentMethod !== undefined) {
      if (!QUOTE_PAYMENT_METHODS.includes(paymentMethod)) {
        throw new Error(`Invalid payment method: ${paymentMethod}`);
      }
      this.props.paymentMethod = paymentMethod;
    }

    this.recalculateTotals();
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

  updateItem(
    itemId: UniqueEntityId | string,
    { unitPrice, quantity, type, description }: UpdateQuoteItemProps,
  ): void {
    this.assertEditable();
    const targetId = typeof itemId === "string" ? itemId : itemId.toString();
    const itemIndex = this.props.items.findIndex(
      (item) => item.id.toString() === targetId,
    );

    if (itemIndex < 0) {
      throw new InvalidQuoteItemError("Quote item not found");
    }

    const currentItem = this.props.items[itemIndex]!;
    this.props.items[itemIndex] = QuoteItem.create(
      {
        unitPrice,
        quantity,
        type,
        serviceCategory: currentItem.serviceCategory,
        discount: currentItem.discount,
        taxes: currentItem.taxes,
        description: description ?? currentItem.description,
        createdAt: currentItem.createdAt,
        updatedAt: new Date(),
      },
      currentItem.id,
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
    const totals = calculateQuoteTotals(this.props.items, {
      discount: this.props.discount,
      taxes: this.props.taxes,
      paymentDiscount: this.props.paymentDiscount,
    });
    this.props.subtotal = totals.subtotal;
    this.props.total = totals.total;
    this.props.value = totals.total;
  }

  private assertNonNegative(value: number, fieldName: string): void {
    if (value < 0) {
      throw new Error(`${fieldName} must be greater than or equal to 0`);
    }
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
        customerId: props.customerId!,
        value: props.value ?? 0,
        description: props.description ?? null,
        vehicleId: props.vehicleId ?? null,
        status: props.status ?? QuoteStatus.DRAFT,
        version: props.version ?? 1,
        items: props.items ?? [],
        subtotal: props.subtotal ?? 0,
        discount: props.discount ?? 0,
        taxes: props.taxes ?? 0,
        paymentDiscount: props.paymentDiscount ?? 0,
        paymentMethod: props.paymentMethod ?? "UNSPECIFIED",
        total: props.total ?? 0,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      resolvedId,
    );
    quote.assertNonNegative(quote.discount, "Discount");
    quote.assertNonNegative(quote.taxes, "Taxes");
    quote.assertNonNegative(quote.paymentDiscount, "Payment discount");
    if (!QUOTE_PAYMENT_METHODS.includes(quote.paymentMethod)) {
      throw new Error(`Invalid payment method: ${quote.paymentMethod}`);
    }
    quote.recalculateTotals();
    return quote;
  }
}
