import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { productSchema } from "@/lib/validations/product"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const { id } = await params
  const product = await db.product.findUnique({
    where: { id },
    include: { supplier: { select: { id: true, name: true } } },
  })
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const { id } = await params
  const body = await request.json()
  const result = productSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const product = await db.product.update({
    where: { id },
    data: result.data,
    include: { supplier: { select: { id: true, name: true } } },
  })
  return NextResponse.json(product)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const { id } = await params
  await db.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
