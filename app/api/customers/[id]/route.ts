import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { customerSchema } from "@/lib/validations/customer"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const { id } = await params
  const customer = await db.customer.findUnique({ where: { id } })
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(customer)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const { id } = await params
  const body = await request.json()
  const result = customerSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const customer = await db.customer.update({ where: { id }, data: result.data })
  return NextResponse.json(customer)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const { id } = await params
  await db.customer.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
