import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orderSchema } from "@/lib/validations/order"
import { getSessionOrUnauthorized } from "@/lib/api-helpers"

export async function GET() {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const orders = await db.order.findMany({
    include: {
      customer: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
      items: { include: { product: { select: { id: true, name: true, sku: true } } } },
      containers: { select: { id: true, containerNumber: true, type: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const body = await request.json()
  const result = orderSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const { items, ...orderData } = result.data

  const order = await db.order.create({
    data: {
      ...orderData,
      items: {
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
  return NextResponse.json(order, { status: 201 })
}
