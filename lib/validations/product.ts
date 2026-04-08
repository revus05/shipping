import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.coerce.number().positive("Price must be positive"),
  currency: z.string().min(1).default("USD"),
  supplierId: z.string().min(1, "Supplier is required"),
})

export type ProductFormValues = z.infer<typeof productSchema>
