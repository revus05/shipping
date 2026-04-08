import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <SidebarProvider>
      <AppSidebar role={session.role} />
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader user={session} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
