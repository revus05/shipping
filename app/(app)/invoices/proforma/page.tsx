import Link from "next/link"
import { Plus, Eye, Pencil, Trash2 } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { DeletePIButton } from "@/components/invoices/delete-pi-button"

type PIRow = Awaited<ReturnType<typeof getPIs>>[number]

async function getPIs() {
  return db.proformaInvoice.findMany({
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          customer: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function ProformaInvoicesPage() {
  const pis = await getPIs()

  const columns: Column<PIRow>[] = [
    {
      key: "piNumber",
      header: "PI Number",
      render: (pi) => (
        <Link href={`/invoices/proforma/${pi.id}`} className="font-medium hover:underline">
          {pi.piNumber}
        </Link>
      ),
    },
    { key: "status", header: "Status", render: (pi) => <StatusBadge status={pi.status} /> },
    {
      key: "order",
      header: "Order",
      render: (pi) => (
        <Link href={`/orders/${pi.order.id}`} className="hover:underline text-sm">
          {pi.order.orderNumber}
        </Link>
      ),
    },
    { key: "customer", header: "Customer", render: (pi) => pi.order.customer.name },
    { key: "issued", header: "Issued", render: (pi) => new Date(pi.issuedDate).toLocaleDateString() },
    { key: "valid", header: "Valid Until", render: (pi) => new Date(pi.validUntil).toLocaleDateString() },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      render: (pi) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/invoices/proforma/${pi.id}`}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/invoices/proforma/${pi.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <DeletePIButton id={pi.id} piNumber={pi.piNumber} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Proforma Invoices"
        description={`${pis.length} total`}
        action={
          <Button asChild size="sm">
            <Link href="/invoices/proforma/new">
              <Plus className="mr-1 h-4 w-4" /> New PI
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={pis} emptyMessage="No proforma invoices yet." />
    </div>
  )
}
