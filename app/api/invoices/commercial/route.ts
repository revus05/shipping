import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { commercialInvoiceSchema } from "@/lib/validations/commercial-invoice"
import { getSessionOrUnauthorized } from "@/lib/api-helpers"

export async function GET() {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const invoices = await db.commercialInvoice.findMany({
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          customer: { select: { name: true } },
          supplier: { select: { name: true } },
        },
      },
      proformaInvoice: { select: { id: true, piNumber: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(invoices)
}

export async function POST(request: Request) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const body = await request.json()
  const result = commercialInvoiceSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const invoice = await db.commercialInvoice.create({
    data: {
      ciNumber: result.data.ciNumber,
      orderId: result.data.orderId,
      piId: result.data.piId ?? null,
      status: result.data.status,
      issuedDate: new Date(result.data.issuedDate),
      paymentTerms: result.data.paymentTerms,
      portOfLoading: result.data.portOfLoading,
      portOfDischarge: result.data.portOfDischarge,
      notes: result.data.notes,
    },
  })
  return NextResponse.json(invoice, { status: 201 })
}
