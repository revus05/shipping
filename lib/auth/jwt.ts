import { SignJWT, jwtVerify } from "jose"
import type { AuthUser, SessionPayload } from "./types"

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-dev-secret")

const ALG = "HS256"
const EXPIRY = "7d"

export async function signToken(payload: AuthUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
