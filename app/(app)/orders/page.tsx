import Link from "next/link"
import { Plus, Pencil, Eye } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { DeleteOrderButton } from "@/components/orders/delete-order-button"

type OrderRow = Awaited<ReturnType<typeof getOrders>>[number]

async function getOrders() {
  return db.order.findMany({
    include: {
      customer: { select: { name: true } },
      supplier: { select: { name: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function OrdersPage() {
  const orders = await getOrders()

  const columns: Column<OrderRow>[] = [
    {
      key: "orderNumber",
      header: "Order #",
      render: (o) => (
        <Link href={`/orders/${o.id}`} className="font-medium hover:underline">
          {o.orderNumber}
        </Link>
      ),
    },
    { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
    { key: "customer", header: "Customer", render: (o) => o.customer.name },
    { key: "supplier", header: "Supplier", render: (o) => o.supplier.name },
    {
      key: "total",
      header: "Total",
      render: (o) => {
        const total = o.items.reduce(
          (s: number, i: (typeof o.items)[number]) => s + Number(i.quantity) * Number(i.unitPrice),
          0,
        )
        return <span className="font-mono text-sm">{total.toFixed(2)}</span>
      },
    },
    {
      key: "date",
      header: "Date",
      render: (o) => new Date(o.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      className: "w-28 text-right",
      render: (o) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/orders/${o.id}`}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/orders/${o.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <DeleteOrderButton id={o.id} orderNumber={o.orderNumber} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Orders"
        description={`${orders.length} total`}
        action={
          <Button asChild size="sm">
            <Link href="/orders/new">
              <Plus className="mr-1 h-4 w-4" /> New Order
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={orders} emptyMessage="No orders yet." />
    </div>
  )
}
