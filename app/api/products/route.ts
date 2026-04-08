import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { productSchema } from "@/lib/validations/product"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET() {
  const { error } = await getSessionOrUnauthorized()
  if (error) return error

  const products = await db.product.findMany({
    include: { supplier: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const body = await request.json()
  const result = productSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const product = await db.product.create({
    data: result.data,
    include: { supplier: { select: { id: true, name: true } } },
  })
  return NextResponse.json(product, { status: 201 })
}
