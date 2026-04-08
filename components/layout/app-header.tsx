"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NavUser } from "@/components/layout/nav-user"
import type { SessionPayload } from "@/lib/auth/types"

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  orders: "Orders",
  invoices: "Invoices",
  proforma: "Proforma Invoices",
  commercial: "Commercial Invoices",
  products: "Products",
  suppliers: "Suppliers",
  customers: "Customers",
  containers: "Containers",
  users: "Users",
  new: "New",
  edit: "Edit",
}

export function AppHeader({ user }: { user: SessionPayload }) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-full" />

      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {segments.map((seg, idx) => {
            const isLast = idx === segments.length - 1
            const label = ROUTE_LABELS[seg] ?? seg
            const href = "/" + segments.slice(0, idx + 1).join("/")

            return isLast ? (
              <BreadcrumbItem key={seg}>
                <BreadcrumbPage>{label}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem key={seg}>
                <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <NavUser user={user} />
    </header>
  )
}
