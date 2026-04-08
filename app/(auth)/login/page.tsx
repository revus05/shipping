import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect("/dashboard")

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded border border-border bg-primary text-primary-foreground font-bold text-lg">
            TW
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">TradeWorks</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
