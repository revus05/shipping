import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orderSchema } from "@/lib/validations/order"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const { id } = await params
  const order = await db.order.findUnique({
    where: { id },
    include: {
      customer: true,
      supplier: true,
      items: { include: { product: true } },
      containers: true,
      proformaInvoices: true,
      commercialInvoices: true,
    },
  })
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(order)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const { id } = await params
  const body = await request.json()
  const result = orderSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const { items, ...orderData } = result.data

  const order = await db.order.update({
    where: { id },
    data: {
      ...orderData,
      items: {
        deleteMany: {},
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          currency: item.currency,
        })),
      },
    },
    include: {
      customer: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
      items: { include: { product: { select: { id: true, name: true, sku: true } } } },
    },
  })
  return NextResponse.json(order)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const { id } = await params
  await db.order.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
