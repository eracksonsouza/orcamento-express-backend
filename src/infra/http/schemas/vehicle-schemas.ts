import { z } from "zod";

import { VehicleType } from "@/src/domain/vehicle/enterprise/enums/vehicle-type";

const uuidSchema = z.uuid();
const currentYear = new Date().getFullYear();
const maxVehicleYear = currentYear + 1;

const licensePlateRegex =
  /^(?:[A-Z]{3}-?[0-9]{4}|[A-Z]{3}-?[0-9][A-Z][0-9]{2})$/;

const vehicleTypeSchema = z.enum(VehicleType);

const licensePlateSchema = z
  .string()
  .trim()
  .toUpperCase()
  .refine((value) => licensePlateRegex.test(value), {
    message: "Invalid license plate format",
  });

const optionalNonEmptyStringSchema = z.string().trim().min(1).optional();

function hasAtLeastOneDefinedValue(data: Record<string, unknown>) {
  return Object.values(data).some((value) => value !== undefined);
}

export const vehicleIdParamsSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();

export const customerIdParamsSchema = z
  .object({
    customerId: uuidSchema,
  })
  .strict();

export const createVehicleBodySchema = z
  .object({
    vehicleId: uuidSchema,
    customerId: uuidSchema,
    brand: z.string().trim().min(1),
    model: z.string().trim().min(1),
    year: z.coerce.number().int().min(1900).max(maxVehicleYear),
    licensePlate: licensePlateSchema,
    type: vehicleTypeSchema,
  })
  .strict();

export const updateVehicleParamsSchema = vehicleIdParamsSchema;

export const updateVehicleBodySchema = z
  .object({
    brand: optionalNonEmptyStringSchema,
    model: optionalNonEmptyStringSchema,
    year: z.coerce.number().int().min(1900).max(maxVehicleYear).optional(),
    licensePlate: licensePlateSchema.optional(),
    type: vehicleTypeSchema.optional(),
  })
  .strict()
  .refine(hasAtLeastOneDefinedValue, {
    message: "At least one field must be provided",
  });

export const deleteVehicleParamsSchema = vehicleIdParamsSchema;

export type VehicleIdParams = z.infer<typeof vehicleIdParamsSchema>;
export type CustomerVehiclesParams = z.infer<typeof customerIdParamsSchema>;
export type CreateVehicleBody = z.infer<typeof createVehicleBodySchema>;
export type UpdateVehicleParams = z.infer<typeof updateVehicleParamsSchema>;
export type UpdateVehicleBody = z.infer<typeof updateVehicleBodySchema>;
export type DeleteVehicleParams = z.infer<typeof deleteVehicleParamsSchema>;
