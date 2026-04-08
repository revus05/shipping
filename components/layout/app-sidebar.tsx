"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Receipt,
  Package,
  Truck,
  Users,
  Container,
  UserCog,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import logo from 'public/logo.png'
import Image from "next/image"

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
  roles: Array<"ADMIN" | "WORKER">
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "WORKER"] },
  { href: "/orders", label: "Orders", icon: ShoppingCart, roles: ["ADMIN", "WORKER"] },
  {
    href: "/invoices/proforma",
    label: "Proforma Invoices",
    icon: FileText,
    roles: ["ADMIN", "WORKER"],
  },
  {
    href: "/invoices/commercial",
    label: "Commercial Invoices",
    icon: Receipt,
    roles: ["ADMIN", "WORKER"],
  },
  { href: "/products", label: "Products", icon: Package, roles: ["ADMIN"] },
  { href: "/suppliers", label: "Suppliers", icon: Truck, roles: ["ADMIN"] },
  { href: "/customers", label: "Customers", icon: Users, roles: ["ADMIN"] },
  { href: "/containers", label: "Containers", icon: Container, roles: ["ADMIN"] },
  { href: "/users", label: "User Management", icon: UserCog, roles: ["ADMIN"] },
]

export function AppSidebar({ role }: { role: "ADMIN" | "WORKER" }) {
  const pathname = usePathname()

  const visibleItems = navItems.filter((item) => item.roles.includes(role))
  const coreItems = visibleItems.slice(0, 4)
  const adminItems = visibleItems.slice(4)

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border px-2 pt-3 pb-2.75">
        <div className="flex items-center gap-2">
          <Image src={logo.src} width={32} height={32} className="flex shrink-0 h-8 w-8 items-center justify-center rounded border border-border bg-primary text-primary-foreground font-bold text-sm" alt="logo" />
          <span className="font-semibold text-sm tracking-wide group-data-[collapsible=icon]:hidden">
            TRADE HOUSE
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(isActive && "bg-accent text-accent-foreground font-medium")}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className={cn(isActive && "bg-accent text-accent-foreground font-medium")}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border px-4 py-3">
        <div className="group-data-[collapsible=icon]:hidden text-xs text-muted-foreground">
          <span className="uppercase tracking-wider font-medium">{role}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
