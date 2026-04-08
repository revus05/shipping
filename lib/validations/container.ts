import { z } from "zod"

export const containerSchema = z.object({
  containerNumber: z.string().min(1, "Container number is required"),
  type: z.enum(["TWENTY_FT", "FORTY_FT", "FORTY_HC"]),
  status: z.enum(["AVAILABLE", "ASSIGNED", "IN_TRANSIT", "DELIVERED"]),
  orderId: z.string().optional().nullable(),
})

export type ContainerFormValues = z.infer<typeof containerSchema>
