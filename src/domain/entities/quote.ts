import { Entity } from "./entity.js";
import type { UniqueEntityId } from "./unique-entity-id.js";

export interface QuoteProps {
    value: number;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Quote extends Entity<QuoteProps> {
    get value(): number {
        return this.props.value;
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
        this.props.value = value;
        this.touch();
    }

    updateDescription(description: string | null): void {
        this.props.description = description;
        this.touch();
    }

    private touch(): void {
        this.props.updatedAt = new Date();
    }

    static create(props: QuoteProps, id?: UniqueEntityId): Quote {
        const quote = new Quote(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
                updatedAt: props.updatedAt ?? new Date(),
            },
            id
        );
        return quote;
    }
}