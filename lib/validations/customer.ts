import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  country: z.string().optional(),
})

export type CustomerFormValues = z.infer<typeof customerSchema>
