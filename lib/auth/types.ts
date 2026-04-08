export type SessionPayload = {
  userId: string
  email: string
  name: string
  role: "ADMIN" | "WORKER"
  iat: number
  exp: number
}

export type AuthUser = Omit<SessionPayload, "iat" | "exp">
