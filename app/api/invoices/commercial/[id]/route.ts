import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { commercialInvoiceSchema } from "@/lib/validations/commercial-invoice"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const { id } = await params
  const invoice = await db.commercialInvoice.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          customer: true,
          supplier: true,
          items: { include: { product: true } },
          containers: true,
        },
      },
      proformaInvoice: true,
    },
  })
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(invoice)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const { id } = await params
  const body = await request.json()
  const result = commercialInvoiceSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const invoice = await db.commercialInvoice.update({
    where: { id },
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
  return NextResponse.json(invoice)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const { id } = await params
  await db.commercialInvoice.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
