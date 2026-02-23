import { z } from "zod";

import type { QuotePaymentMethod } from "@/src/domain/quote/enterprise/entities/quote";
import { QuoteItemType } from "@/src/domain/quote/enterprise/enums/quote-item-type";
import { QuoteStatus } from "@/src/domain/quote/enterprise/enums/quote-status";

const uuidSchema = z.uuid();

const quoteStatusSchema = z.enum(QuoteStatus);
const quoteItemTypeSchema = z.enum(QuoteItemType);
const quotePaymentMethodSchema = z.enum([
  "UNSPECIFIED",
  "CASH",
  "PIX",
  "CARD",
  "BANK_TRANSFER",
] satisfies [QuotePaymentMethod, ...QuotePaymentMethod[]]);

const optionalQueryStringSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.string().min(1).optional(),
);

const optionalDateQuerySchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.coerce.date().optional(),
);

const optionalItemDescriptionSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  },
  z.string().min(1).nullable().optional(),
);

function hasAtLeastOneDefinedValue(data: Record<string, unknown>) {
  return Object.values(data).some((value) => value !== undefined);
}

export const quoteIdParamsSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();

export const quoteItemParamsSchema = z
  .object({
    id: uuidSchema,
    itemId: uuidSchema,
  })
  .strict();

export const createQuoteBodySchema = z
  .object({
    quoteId: uuidSchema.optional(),
    customerId: uuidSchema,
  })
  .strict();

export const getQuoteParamsSchema = quoteIdParamsSchema;

export const listQuotesQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
    query: optionalQueryStringSchema,
    customerId: uuidSchema.optional(),
    status: quoteStatusSchema.optional(),
    startDate: optionalDateQuerySchema,
    endDate: optionalDateQuerySchema,
  })
  .strict()
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.startDate <= data.endDate,
    {
      message: "startDate must be less than or equal to endDate",
      path: ["endDate"],
    },
  );

export const addQuoteItemParamsSchema = quoteIdParamsSchema;

export const addQuoteItemBodySchema = z
  .object({
    unitPrice: z.coerce.number().min(0),
    quantity: z.coerce.number().int().positive(),
    type: quoteItemTypeSchema,
    description: optionalItemDescriptionSchema,
  })
  .strict();

export const removeQuoteItemParamsSchema = quoteItemParamsSchema;

export const updateQuoteItemParamsSchema = quoteItemParamsSchema;

export const updateQuoteItemBodySchema = z
  .object({
    unitPrice: z.coerce.number().min(0),
    quantity: z.coerce.number().int().positive(),
    type: quoteItemTypeSchema,
    description: optionalItemDescriptionSchema,
  })
  .strict();

export const updateQuoteCommercialTermsParamsSchema = quoteIdParamsSchema;

export const updateQuoteCommercialTermsBodySchema = z
  .object({
    discount: z.coerce.number().min(0).optional(),
    taxes: z.coerce.number().min(0).optional(),
    paymentDiscount: z.coerce.number().min(0).optional(),
    paymentMethod: quotePaymentMethodSchema.optional(),
  })
  .strict()
  .refine(hasAtLeastOneDefinedValue, {
    message: "At least one field must be provided",
  });

export const submitQuoteParamsSchema = quoteIdParamsSchema;

export const createNewQuoteVersionParamsSchema = quoteIdParamsSchema;

export type CreateQuoteBody = z.infer<typeof createQuoteBodySchema>;
export type GetQuoteParams = z.infer<typeof getQuoteParamsSchema>;
export type ListQuotesQuery = z.infer<typeof listQuotesQuerySchema>;
export type AddQuoteItemParams = z.infer<typeof addQuoteItemParamsSchema>;
export type AddQuoteItemBody = z.infer<typeof addQuoteItemBodySchema>;
export type RemoveQuoteItemParams = z.infer<typeof removeQuoteItemParamsSchema>;
export type UpdateQuoteItemParams = z.infer<typeof updateQuoteItemParamsSchema>;
export type UpdateQuoteItemBody = z.infer<typeof updateQuoteItemBodySchema>;
export type UpdateQuoteCommercialTermsParams = z.infer<
  typeof updateQuoteCommercialTermsParamsSchema
>;
export type UpdateQuoteCommercialTermsBody = z.infer<
  typeof updateQuoteCommercialTermsBodySchema
>;
export type SubmitQuoteParams = z.infer<typeof submitQuoteParamsSchema>;
export type CreateNewQuoteVersionParams = z.infer<
  typeof createNewQuoteVersionParamsSchema
>;
