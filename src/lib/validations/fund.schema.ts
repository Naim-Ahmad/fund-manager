import { z } from "zod";

export const fundSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["locked", "spendable"]),
  allocation_pct: z.number().min(0).max(100),
});
