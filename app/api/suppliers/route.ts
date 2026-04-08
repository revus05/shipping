import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { supplierSchema } from "@/lib/validations/supplier"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET() {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const suppliers = await db.supplier.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(suppliers)
}

export async function POST(request: Request) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const body = await request.json()
  const result = supplierSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const supplier = await db.supplier.create({ data: result.data })
  return NextResponse.json(supplier, { status: 201 })
}
