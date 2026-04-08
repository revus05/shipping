import { z } from "zod"

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unitPrice: z.coerce.number().positive("Price must be positive"),
  currency: z.string().min(1),
})

export const orderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  customerId: z.string().min(1, "Customer is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  status: z.enum(["DRAFT", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
})

export type OrderItemFormValues = z.infer<typeof orderItemSchema>
export type OrderFormValues = z.infer<typeof orderSchema>
