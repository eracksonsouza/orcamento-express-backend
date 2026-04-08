import { z } from "zod";

export const registerBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
}).strict();

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
}).strict();
