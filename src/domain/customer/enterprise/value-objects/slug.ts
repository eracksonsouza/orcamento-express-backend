export class Slug {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(text: string): Slug {
    const slug = text
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return new Slug(slug);
  }
}
