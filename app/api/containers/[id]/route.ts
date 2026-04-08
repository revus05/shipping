import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { containerSchema } from "@/lib/validations/container"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const { id } = await params
  const container = await db.container.findUnique({
    where: { id },
    include: { order: { select: { id: true, orderNumber: true } } },
  })
  if (!container) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(container)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const { id } = await params
  const body = await request.json()
  const result = containerSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const container = await db.container.update({
    where: { id },
    data: {
      containerNumber: result.data.containerNumber,
      type: result.data.type,
      status: result.data.status,
      orderId: result.data.orderId ?? null,
    },
    include: { order: { select: { id: true, orderNumber: true } } },
  })
  return NextResponse.json(container)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const { id } = await params
  await db.container.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
