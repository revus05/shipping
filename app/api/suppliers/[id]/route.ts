import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { supplierSchema } from "@/lib/validations/supplier"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const { id } = await params
  const supplier = await db.supplier.findUnique({ where: { id } })
  if (!supplier) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(supplier)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const { id } = await params
  const body = await request.json()
  const result = supplierSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const supplier = await db.supplier.update({ where: { id }, data: result.data })
  return NextResponse.json(supplier)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const { id } = await params
  await db.supplier.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
