import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { containerSchema } from "@/lib/validations/container"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET() {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const containers = await db.container.findMany({
    include: { order: { select: { id: true, orderNumber: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(containers)
}

export async function POST(request: Request) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const body = await request.json()
  const result = containerSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const container = await db.container.create({
    data: {
      containerNumber: result.data.containerNumber,
      type: result.data.type,
      status: result.data.status,
      orderId: result.data.orderId ?? null,
    },
    include: { order: { select: { id: true, orderNumber: true } } },
  })
  return NextResponse.json(container, { status: 201 })
}
