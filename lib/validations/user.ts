import { z } from "zod"

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "WORKER"]),
})

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z.string().min(1, "Name is required").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["ADMIN", "WORKER"]).optional(),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
