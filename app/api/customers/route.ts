import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { customerSchema } from "@/lib/validations/customer"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET() {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const customers = await db.customer.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(customers)
}

export async function POST(request: Request) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const body = await request.json()
  const result = customerSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const customer = await db.customer.create({ data: result.data })
  return NextResponse.json(customer, { status: 201 })
}
