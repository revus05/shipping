import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import type { SessionPayload } from "@/lib/auth/types"

export async function getSessionOrUnauthorized(): Promise<
  { session: SessionPayload; error: null } | { session: null; error: NextResponse }
> {
  const session = await getSession()
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  return { session, error: null }
}

export function requireAdmin(session: SessionPayload): NextResponse | null {
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}
