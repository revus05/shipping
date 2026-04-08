import { notFound } from "next/navigation"
import Link from "next/link"
import { Pencil, Printer } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge, CONTAINER_TYPE_LABELS } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/shared/data-table"

export default async function CIDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ci = await db.commercialInvoice.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          customer: true,
          supplier: true,
          items: { include: { product: true } },
          containers: true,
        },
      },
      proformaInvoice: true,
    },
  })
  if (!ci) notFound()

  const total = ci.order.items.reduce(
    (s: number, i: (typeof ci.order.items)[number]) => s + Number(i.quantity) * Number(i.unitPrice),
    0,
  )
  const currency = ci.order.items[0]?.currency ?? "USD"

  type ItemRow = (typeof ci.order.items)[number]
  const itemColumns: Column<ItemRow>[] = [
    { key: "product", header: "Description", render: (i) => i.product.name },
    { key: "sku", header: "HS / SKU", render: (i) => i.product.sku },
    { key: "qty", header: "Quantity", render: (i) => `${Number(i.quantity)} ${i.product.unit}` },
    { key: "price", header: "Unit Price", render: (i) => `${Number(i.unitPrice).toFixed(2)} ${i.currency}` },
    {
      key: "amount",
      header: "Amount",
      render: (i) => (
        <span className="font-mono">{(Number(i.quantity) * Number(i.unitPrice)).toFixed(2)}</span>
      ),
    },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title={`CI ${ci.ciNumber}`}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/invoices/commercial/${id}/edit`}>
                <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="print:hidden">
              <Printer className="mr-1 h-3.5 w-3.5" /> Print
            </Button>
          </div>
        }
      />

      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-wide uppercase">Commercial Invoice</h2>
            <p className="text-2xl font-mono font-semibold mt-1">{ci.ciNumber}</p>
          </div>
          <StatusBadge status={ci.status} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Exporter / Seller</p>
            <p className="font-semibold">{ci.order.supplier.name}</p>
            {ci.order.supplier.address && <p className="text-sm text-muted-foreground">{ci.order.supplier.address}</p>}
            {ci.order.supplier.country && <p className="text-sm text-muted-foreground">{ci.order.supplier.country}</p>}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Importer / Buyer</p>
            <p className="font-semibold">{ci.order.customer.name}</p>
            {ci.order.customer.address && <p className="text-sm text-muted-foreground">{ci.order.customer.address}</p>}
            {ci.order.customer.country && <p className="text-sm text-muted-foreground">{ci.order.customer.country}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Issue Date", value: new Date(ci.issuedDate).toLocaleDateString() },
            { label: "Order Ref", value: ci.order.orderNumber },
            { label: "Port of Loading", value: ci.portOfLoading ?? "—" },
            { label: "Port of Discharge", value: ci.portOfDischarge ?? "—" },
          ].map((item) => (
            <div key={item.label} className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className="font-medium text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        {ci.paymentTerms && (
          <div className="rounded-md border border-border p-3">
            <p className="text-xs text-muted-foreground mb-1">Payment Terms</p>
            <p className="text-sm font-medium">{ci.paymentTerms}</p>
          </div>
        )}

        {ci.proformaInvoice && (
          <div className="rounded-md border border-border p-3">
            <p className="text-xs text-muted-foreground mb-1">Proforma Invoice Reference</p>
            <Link href={`/invoices/proforma/${ci.proformaInvoice.id}`} className="text-sm font-medium hover:underline">
              {ci.proformaInvoice.piNumber}
            </Link>
          </div>
        )}

        <DataTable columns={itemColumns} data={ci.order.items} />

        <div className="flex justify-end">
          <div className="rounded-md border border-border px-6 py-3 min-w-48">
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span className="font-mono">{total.toFixed(2)} {currency}</span>
            </div>
          </div>
        </div>

        {/* Containers */}
        {ci.order.containers.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Containers</p>
            <div className="flex flex-wrap gap-2">
              {ci.order.containers.map((c: (typeof ci.order.containers)[number]) => (
                <span key={c.id} className="rounded border border-border px-2 py-1 text-xs font-mono">
                  {c.containerNumber} ({CONTAINER_TYPE_LABELS[c.type]})
                </span>
              ))}
            </div>
          </div>
        )}

        {ci.notes && (
          <div className="rounded-md border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Remarks</p>
            <p className="text-sm whitespace-pre-wrap">{ci.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
