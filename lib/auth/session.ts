import "server-only"
import { cookies } from "next/headers"
import { verifyToken } from "./jwt"
import type { AuthUser, SessionPayload } from "./types"

export const COOKIE_NAME = "auth-token"

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) throw new Error("Unauthorized")
  return session
}

export function toAuthUser(session: SessionPayload): AuthUser {
  return {
    userId: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
  }
}
