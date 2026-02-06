import { expect, test } from "vitest";
import { Slug } from "./slug";

test("should create a valid slug", () => {
  const text = "Hello World! This is a Test.";

  const slug = Slug.create(text);

  expect(slug.value).toBe("hello-world-this-is-a-test");
});

test ("should handle accented characters", () => {
  const text = "Café com Leite é ótimo!";

  const slug = Slug.create(text);

  expect(slug.value).toBe("cafe-com-leite-e-otimo");
});
