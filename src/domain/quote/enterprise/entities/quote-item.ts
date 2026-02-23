import { Entity } from "@/src/core/entities/entity";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import { QuoteItemType, isValidQuoteItemType } from "@/src/domain/quote/enterprise/enums/quote-item-type";

export type QuoteServiceCategory =
  | "MANUTENCAO"
  | "PINTURA"
  | "DESSAMASSAR"
  | "LAVAGEM";

const QUOTE_SERVICE_CATEGORIES: QuoteServiceCategory[] = [
  "MANUTENCAO",
  "PINTURA",
  "DESSAMASSAR",
  "LAVAGEM",
];

export interface QuoteItemProps {
  unitPrice: number;
  quantity: number;
  type: QuoteItemType;
  serviceCategory: QuoteServiceCategory | null;
  discount: number;
  taxes: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuoteItemProps {
  unitPrice: number;
  quantity: number;
  type: QuoteItemType;
  serviceCategory?: QuoteServiceCategory | null;
  discount?: number;
  taxes?: number;
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

  get serviceCategory(): QuoteServiceCategory | null {
    return this.props.serviceCategory;
  }

  get discount(): number {
    return this.props.discount;
  }

  get taxes(): number {
    return this.props.taxes;
  }

  get description(): string | null {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  calculateTotal(): number {
    const grossTotal = this.props.unitPrice * this.props.quantity;
    return Math.max(0, grossTotal - this.props.discount + this.props.taxes);
  }

  static create(props: CreateQuoteItemProps, id?: UniqueEntityId): QuoteItem {
    if (props.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (props.unitPrice < 0) {
      throw new Error("Unit price must be greater than or equal to 0");
    }

    if ((props.discount ?? 0) < 0) {
      throw new Error("Discount must be greater than or equal to 0");
    }

    if ((props.taxes ?? 0) < 0) {
      throw new Error("Taxes must be greater than or equal to 0");
    }

    if (!isValidQuoteItemType(props.type)) {
      throw new Error(`Invalid item type: ${props.type}`);
    }

    if (props.serviceCategory != null) {
      if (props.type !== QuoteItemType.SERVICE) {
        throw new Error("Service category is only allowed for SERVICE items");
      }

      if (!QUOTE_SERVICE_CATEGORIES.includes(props.serviceCategory)) {
        throw new Error(`Invalid service category: ${props.serviceCategory}`);
      }
    }

    return new QuoteItem(
      {
        unitPrice: props.unitPrice,
        quantity: props.quantity,
        type: props.type,
        serviceCategory: props.serviceCategory ?? null,
        discount: props.discount ?? 0,
        taxes: props.taxes ?? 0,
        description: props.description ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
