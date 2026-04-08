import Link from "next/link"
import { ShoppingCart, Package, Truck, Users, Container, FileText, Receipt } from "lucide-react"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/status-badge"
import { DataTable, type Column } from "@/components/shared/data-table"

type RecentOrder = Awaited<ReturnType<typeof getRecentOrders>>[number]

async function getRecentOrders() {
  return db.order.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true } },
      items: true,
    },
  })
}

async function getStats() {
  const [orders, products, suppliers, customers, containers, pis, cis] = await Promise.all([
    db.order.groupBy({ by: ["status"], _count: true }),
    db.product.count(),
    db.supplier.count(),
    db.customer.count(),
    db.container.groupBy({ by: ["status"], _count: true }),
    db.proformaInvoice.count(),
    db.commercialInvoice.count(),
  ])

  const orderCounts = Object.fromEntries(
    (orders as Array<{ status: string; _count: number }>).map((o) => [o.status, o._count]),
  )
  const containerCounts = Object.fromEntries(
    (containers as Array<{ status: string; _count: number }>).map((c) => [c.status, c._count]),
  )

  return {
    orderCounts: orderCounts as Record<string, number>,
    products,
    suppliers,
    customers,
    containerCounts: containerCounts as Record<string, number>,
    pis,
    cis,
  }
}

export default async function DashboardPage() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()])

  const summaryCards = [
    {
      title: "Total Orders",
      value: (Object.values(stats.orderCounts) as number[]).reduce((a, b) => a + b, 0),
      icon: ShoppingCart,
      href: "/orders",
    },
    { title: "Products", value: stats.products, icon: Package, href: "/products" },
    { title: "Suppliers", value: stats.suppliers, icon: Truck, href: "/suppliers" },
    { title: "Customers", value: stats.customers, icon: Users, href: "/customers" },
    { title: "Proforma Invoices", value: stats.pis, icon: FileText, href: "/invoices/proforma" },
    { title: "Commercial Invoices", value: stats.cis, icon: Receipt, href: "/invoices/commercial" },
  ]

  const orderStatusCards = [
    { label: "Draft", status: "DRAFT", count: stats.orderCounts["DRAFT"] ?? 0 },
    { label: "Confirmed", status: "CONFIRMED", count: stats.orderCounts["CONFIRMED"] ?? 0 },
    { label: "Shipped", status: "SHIPPED", count: stats.orderCounts["SHIPPED"] ?? 0 },
    { label: "Delivered", status: "DELIVERED", count: stats.orderCounts["DELIVERED"] ?? 0 },
  ]

  const containerStatusCards = [
    { label: "Available", status: "AVAILABLE", count: stats.containerCounts["AVAILABLE"] ?? 0 },
    { label: "Assigned", status: "ASSIGNED", count: stats.containerCounts["ASSIGNED"] ?? 0 },
    { label: "In Transit", status: "IN_TRANSIT", count: stats.containerCounts["IN_TRANSIT"] ?? 0 },
    { label: "Delivered", status: "DELIVERED", count: stats.containerCounts["DELIVERED"] ?? 0 },
  ]

  const recentColumns: Column<RecentOrder>[] = [
    {
      key: "order",
      header: "Order #",
      render: (o) => (
        <Link href={`/orders/${o.id}`} className="font-medium hover:underline">
          {o.orderNumber}
        </Link>
      ),
    },
    { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
    { key: "customer", header: "Customer", render: (o) => o.customer.name },
    {
      key: "total",
      header: "Total",
      render: (o) => {
        const t = o.items.reduce(
          (s: number, i: { quantity: unknown; unitPrice: unknown }) =>
            s + Number(i.quantity) * Number(i.unitPrice),
          0,
        )
        return <span className="font-mono text-sm">{t.toFixed(2)}</span>
      },
    },
    { key: "date", header: "Date", render: (o) => new Date(o.createdAt).toLocaleDateString() },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your trading operations</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <card.icon className="h-3.5 w-3.5" />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-semibold font-mono">{card.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Order statuses */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {orderStatusCards.map((s) => (
              <div key={s.status} className="flex items-center justify-between rounded-md border border-border p-3">
                <StatusBadge status={s.status} />
                <span className="font-mono font-semibold text-sm">{s.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Container statuses */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Container className="h-4 w-4" /> Containers by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {containerStatusCards.map((s) => (
              <div key={s.status} className="flex items-center justify-between rounded-md border border-border p-3">
                <StatusBadge status={s.status} />
                <span className="font-mono font-semibold text-sm">{s.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Recent Orders</h2>
          <Link href="/orders" className="text-xs text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        <DataTable columns={recentColumns} data={recentOrders} emptyMessage="No orders yet." />
      </div>
    </div>
  )
}
