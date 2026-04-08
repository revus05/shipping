import { notFound } from "next/navigation"
import Link from "next/link"
import { Pencil, Printer } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/shared/data-table"

export default async function PIDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pi = await db.proformaInvoice.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          customer: true,
          supplier: true,
          items: { include: { product: true } },
        },
      },
    },
  })
  if (!pi) notFound()

  const total = pi.order.items.reduce(
    (s: number, i: (typeof pi.order.items)[number]) => s + Number(i.quantity) * Number(i.unitPrice),
    0,
  )
  const currency = pi.order.items[0]?.currency ?? "USD"

  type ItemRow = (typeof pi.order.items)[number]
  const itemColumns: Column<ItemRow>[] = [
    { key: "product", header: "Description", render: (i) => i.product.name },
    { key: "sku", header: "SKU", render: (i) => i.product.sku },
    { key: "qty", header: "Qty", render: (i) => `${Number(i.quantity)} ${i.product.unit}` },
    { key: "price", header: "Unit Price", render: (i) => `${Number(i.unitPrice).toFixed(2)} ${i.currency}` },
    {
      key: "total",
      header: "Amount",
      render: (i) => (
        <span className="font-mono">{(Number(i.quantity) * Number(i.unitPrice)).toFixed(2)}</span>
      ),
    },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title={`PI ${pi.piNumber}`}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/invoices/proforma/${id}/edit`}>
                <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
              <Printer className="mr-1 h-3.5 w-3.5" /> Print
            </Button>
          </div>
        }
      />

      {/* Document header */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-wide uppercase">Proforma Invoice</h2>
            <p className="text-2xl font-mono font-semibold mt-1">{pi.piNumber}</p>
          </div>
          <StatusBadge status={pi.status} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Seller</p>
            <p className="font-semibold">{pi.order.supplier.name}</p>
            {pi.order.supplier.address && <p className="text-sm text-muted-foreground">{pi.order.supplier.address}</p>}
            {pi.order.supplier.country && <p className="text-sm text-muted-foreground">{pi.order.supplier.country}</p>}
            {pi.order.supplier.email && <p className="text-sm text-muted-foreground">{pi.order.supplier.email}</p>}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Buyer</p>
            <p className="font-semibold">{pi.order.customer.name}</p>
            {pi.order.customer.address && <p className="text-sm text-muted-foreground">{pi.order.customer.address}</p>}
            {pi.order.customer.country && <p className="text-sm text-muted-foreground">{pi.order.customer.country}</p>}
            {pi.order.customer.email && <p className="text-sm text-muted-foreground">{pi.order.customer.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Issue Date", value: new Date(pi.issuedDate).toLocaleDateString() },
            { label: "Valid Until", value: new Date(pi.validUntil).toLocaleDateString() },
            { label: "Order Ref", value: pi.order.orderNumber },
          ].map((item) => (
            <div key={item.label} className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className="font-medium text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        <DataTable columns={itemColumns} data={pi.order.items} />

        <div className="flex justify-end">
          <div className="rounded-md border border-border px-6 py-3 min-w-48">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-mono">{total.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1">
              <span>Total:</span>
              <span className="font-mono">{total.toFixed(2)} {currency}</span>
            </div>
          </div>
        </div>

        {pi.notes && (
          <div className="rounded-md border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Notes / Terms</p>
            <p className="text-sm whitespace-pre-wrap">{pi.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
