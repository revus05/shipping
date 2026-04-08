import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"

const PUBLIC_PATHS = ["/login", "/api/auth/login"]

const ADMIN_ONLY_SEGMENTS = ["/users", "/suppliers", "/customers", "/products", "/containers"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const session = await verifyToken(token)

  if (!session) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("auth-token")
    return response
  }

  if (
    session.role !== "ADMIN" &&
    ADMIN_ONLY_SEGMENTS.some((seg) => pathname.startsWith(seg))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth/logout).*)"],
}
