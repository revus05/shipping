import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth/password"
import { createUserSchema } from "@/lib/validations/user"
import { getSessionOrUnauthorized, requireAdmin } from "@/lib/api-helpers"

export async function GET() {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const users = await db.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const { session, error } = await getSessionOrUnauthorized()
  if (error) return error
  const adminError = requireAdmin(session)
  if (adminError) return adminError

  const body = await request.json()
  const result = createUserSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const existing = await db.user.findUnique({ where: { email: result.data.email } })
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 })
  }

  const user = await db.user.create({
    data: {
      email: result.data.email,
      name: result.data.name,
      role: result.data.role,
      passwordHash: await hashPassword(result.data.password),
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })
  return NextResponse.json(user, { status: 201 })
}
