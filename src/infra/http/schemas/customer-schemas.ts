import { z } from "zod";

const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "live.com",
  "msn.com",
  "protonmail.com",
  "proton.me",
];

function isAllowedEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return domain.endsWith(".br") || ALLOWED_EMAIL_DOMAINS.includes(domain);
}

const uuidSchema = z.uuid();

const optionalQueryStringSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.string().min(1).optional(),
);

const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ""))
  .refine((digits) => digits.length >= 10 && digits.length <= 11, {
    message: "Phone must have 10 to 11 digits",
  });

export const customerIdParamsSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();

export const createCustomerBodySchema = z
  .object({
    customerId: uuidSchema.optional(),
    name: z.string().trim().min(1),
    email: z.string().trim().email().max(254).refine(isAllowedEmail),
    phone: phoneSchema,
  })
  .strict();

export const listCustomersQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
    query: optionalQueryStringSchema,
  })
  .strict();

export type CustomerIdParams = z.infer<typeof customerIdParamsSchema>;
export type CreateCustomerBody = z.infer<typeof createCustomerBodySchema>;
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
