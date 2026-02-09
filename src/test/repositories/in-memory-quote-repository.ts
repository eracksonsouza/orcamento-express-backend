import type { Quote } from "@/src/domain/quote/enterprise/entities/quote";

export class InMemoryQuoteRepository {
  public items: Quote[] = [];

  async create(quote: Quote) {
    this.items.push(quote);
  }
}
