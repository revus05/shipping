import { z } from "zod"

export const commercialInvoiceSchema = z.object({
  ciNumber: z.string().min(1, "CI number is required"),
  orderId: z.string().min(1, "Order is required"),
  piId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "ISSUED"]),
  issuedDate: z.string().min(1, "Issue date is required"),
  paymentTerms: z.string().optional(),
  portOfLoading: z.string().optional(),
  portOfDischarge: z.string().optional(),
  notes: z.string().optional(),
})

export type CommercialInvoiceFormValues = z.infer<typeof commercialInvoiceSchema>
