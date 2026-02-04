import { Entity } from "./entity.js";

export interface QuoteItemProps {
    unitPrice: number;
    quantity: number;
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

    get description(): string | null | undefined {
        return this.props.description;
    }

    get createdAt(): Date {
        return this.props.createdAt!;
    }

    get updatedAt(): Date {
        return this.props.updatedAt!;
    }
}