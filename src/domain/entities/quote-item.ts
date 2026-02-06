import { Entity } from "./entity.js";
import { UniqueEntityId } from "./unique-entity-id.js";
import {
  QuoteItemType,
  isValidQuoteItemType,
} from "./enums/quote-item-type.js";

export interface QuoteItemProps {
  unitPrice: number;
  quantity: number;
  type: QuoteItemType;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class QuoteItem extends Entity<QuoteItemProps> {
  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get type(): QuoteItemType {
    return this.props.type;
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

  calculateTotal(): number {
    return this.props.unitPrice * this.props.quantity;
  }

  static create(
    props: Partial<QuoteItemProps> & {
      unitPrice: number;
      quantity: number;
      type: QuoteItemType;
    },
    id?: UniqueEntityId | string,
  ): QuoteItem {
    if (props.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (props.unitPrice < 0) {
      throw new Error("Unit price must be greater than or equal to 0");
    }

    if (!isValidQuoteItemType(props.type)) {
      throw new Error(`Invalid item type: ${props.type}`);
    }

    const resolvedId = typeof id === "string" ? new UniqueEntityId(id) : id;
    return new QuoteItem(
      {
        unitPrice: props.unitPrice,
        quantity: props.quantity,
        type: props.type,
        description: props.description ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      resolvedId,
    );
  }
}
