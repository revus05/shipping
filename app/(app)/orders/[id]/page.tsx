import { notFound } from "next/navigation"
import Link from "next/link"
import { Pencil, FileText, Receipt } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/shared/data-table"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await db.order.findUnique({
    where: { id },
    include: {
      customer: true,
      supplier: true,
      items: { include: { product: true } },
      containers: true,
      proformaInvoices: true,
      commercialInvoices: true,
    },
  })
  if (!order) notFound()

  const total = order.items.reduce(
    (s: number, i: (typeof order.items)[number]) => s + Number(i.quantity) * Number(i.unitPrice),
    0,
  )

  type ItemRow = (typeof order.items)[number]
  const itemColumns: Column<ItemRow>[] = [
    { key: "product", header: "Product", render: (i) => <span className="font-medium">{i.product.name}</span> },
    { key: "sku", header: "SKU", render: (i) => <code className="text-xs">{i.product.sku}</code> },
    { key: "qty", header: "Quantity", render: (i) => `${Number(i.quantity)} ${i.product.unit}` },
    { key: "price", header: "Unit Price", render: (i) => `${Number(i.unitPrice).toFixed(2)} ${i.currency}` },
    {
      key: "subtotal",
      header: "Subtotal",
      render: (i) => (
        <span className="font-mono">{(Number(i.quantity) * Number(i.unitPrice)).toFixed(2)} {i.currency}</span>
      ),
    },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title={`Order ${order.orderNumber}`}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/orders/${id}/edit`}>
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Link>
          </Button>
        }
      />

      {/* Order details */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Status", value: <StatusBadge status={order.status} /> },
          { label: "Customer", value: order.customer.name },
          { label: "Supplier", value: order.supplier.name },
          { label: "Date", value: new Date(order.createdAt).toLocaleDateString() },
        ].map((item) => (
          <div key={item.label} className="rounded-md border border-border p-3">
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <div className="text-sm font-medium">{item.value}</div>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="rounded-md border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Notes</p>
          <p className="text-sm">{order.notes}</p>
        </div>
      )}

      {/* Items */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Order Items</h2>
        <DataTable columns={itemColumns} data={order.items} />
        <div className="mt-3 flex justify-end">
          <div className="rounded-md border border-border px-4 py-2 text-sm">
            <span className="text-muted-foreground mr-3">Total:</span>
            <span className="font-mono font-semibold">{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" /> Proforma Invoices
            </h3>
            <Button asChild variant="outline" size="sm">
              <Link href={`/invoices/proforma/new?orderId=${id}`}>+ New PI</Link>
            </Button>
          </div>
          {order.proformaInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No proforma invoices</p>
          ) : (
            <ul className="space-y-1">
              {order.proformaInvoices.map((pi: (typeof order.proformaInvoices)[number]) => (
                <li key={pi.id} className="flex items-center justify-between text-sm">
                  <Link href={`/invoices/proforma/${pi.id}`} className="hover:underline font-medium">
                    {pi.piNumber}
                  </Link>
                  <StatusBadge status={pi.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-md border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Receipt className="h-4 w-4" /> Commercial Invoices
            </h3>
            <Button asChild variant="outline" size="sm">
              <Link href={`/invoices/commercial/new?orderId=${id}`}>+ New CI</Link>
            </Button>
          </div>
          {order.commercialInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No commercial invoices</p>
          ) : (
            <ul className="space-y-1">
              {order.commercialInvoices.map((ci: (typeof order.commercialInvoices)[number]) => (
                <li key={ci.id} className="flex items-center justify-between text-sm">
                  <Link href={`/invoices/commercial/${ci.id}`} className="hover:underline font-medium">
                    {ci.ciNumber}
                  </Link>
                  <StatusBadge status={ci.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
