import { z } from "zod"

export const proformaInvoiceSchema = z.object({
  piNumber: z.string().min(1, "PI number is required"),
  orderId: z.string().min(1, "Order is required"),
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED"]),
  issuedDate: z.string().min(1, "Issue date is required"),
  validUntil: z.string().min(1, "Valid until date is required"),
  notes: z.string().optional(),
})

export type ProformaInvoiceFormValues = z.infer<typeof proformaInvoiceSchema>
