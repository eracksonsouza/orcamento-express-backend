import { Entity } from "@/src/core/entities/entity";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";

export interface CustomerProps {
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerProps {
  name: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Customer extends Entity<CustomerProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateName(name: string): void {
    this.props.name = name;
    this.touch();
  }

  updateEmail(email: string): void {
    this.props.email = email;
    this.touch();
  }

  updatePhone(phone: string): void {
    this.props.phone = phone;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  static create(props: CreateCustomerProps, id?: UniqueEntityId): Customer {
    const customer = new Customer(
      {
        name: props.name,
        email: props.email ?? "", // Default to empty string
        phone: props.phone ?? "", // Default to empty string
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return customer;
  }
  // ...existing code...
}
