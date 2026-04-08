import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { proformaInvoiceSchema } from "@/lib/validations/proforma-invoice"
import { getSessionOrUnauthorized } from "@/lib/api-helpers"

export async function GET() {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const invoices = await db.proformaInvoice.findMany({
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          customer: { select: { name: true } },
          supplier: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(invoices)
}

export async function POST(request: Request) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const body = await request.json()
  const result = proformaInvoiceSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const invoice = await db.proformaInvoice.create({
    data: {
      piNumber: result.data.piNumber,
      orderId: result.data.orderId,
      status: result.data.status,
      issuedDate: new Date(result.data.issuedDate),
      validUntil: new Date(result.data.validUntil),
      notes: result.data.notes,
    },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          customer: { select: { name: true } },
          supplier: { select: { name: true } },
        },
      },
    },
  })
  return NextResponse.json(invoice, { status: 201 })
}
