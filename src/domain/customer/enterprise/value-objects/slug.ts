export class Slug {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /* 
    A static factory method to create a Slug instance from a given string.
    It converts the string to a URL-friendly slug by:
    - Converting to lowercase
    - Trimming whitespace
    - Removing non-word characters
    - Replacing spaces and underscores with hyphens
    - Removing leading and trailing hyphens
    */
  static create(text: string): Slug {
    const slug = text
      .normalize("NFKD") // Normalize to decompose accented characters
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens

    return new Slug(slug);
  }
}