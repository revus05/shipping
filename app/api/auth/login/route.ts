import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyPassword } from "@/lib/auth/password"
import { signToken } from "@/lib/auth/jwt"
import { COOKIE_NAME } from "@/lib/auth/session"
import { loginSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email: result.data.email } })

    if (!user || !(await verifyPassword(result.data.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "ADMIN" | "WORKER",
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
