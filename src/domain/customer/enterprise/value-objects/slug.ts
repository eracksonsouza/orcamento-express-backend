export class Slug {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  // Cria um slug amigável para URL.
  static create(text: string): Slug {
    const slug = text
      .normalize("NFKD") // Normaliza caracteres acentuados
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens

    return new Slug(slug);
  }
}
