import Link from "next/link"
import { Plus, Eye, Pencil } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { DeleteCIButton } from "@/components/invoices/delete-ci-button"

type CIRow = Awaited<ReturnType<typeof getCIs>>[number]

async function getCIs() {
  return db.commercialInvoice.findMany({
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          customer: { select: { name: true } },
        },
      },
      proformaInvoice: { select: { id: true, piNumber: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function CommercialInvoicesPage() {
  const cis = await getCIs()

  const columns: Column<CIRow>[] = [
    {
      key: "ciNumber",
      header: "CI Number",
      render: (ci) => (
        <Link href={`/invoices/commercial/${ci.id}`} className="font-medium hover:underline">
          {ci.ciNumber}
        </Link>
      ),
    },
    { key: "status", header: "Status", render: (ci) => <StatusBadge status={ci.status} /> },
    {
      key: "order",
      header: "Order",
      render: (ci) => (
        <Link href={`/orders/${ci.order.id}`} className="hover:underline text-sm">
          {ci.order.orderNumber}
        </Link>
      ),
    },
    { key: "customer", header: "Customer", render: (ci) => ci.order.customer.name },
    {
      key: "pi",
      header: "PI Ref",
      render: (ci) =>
        ci.proformaInvoice ? (
          <Link href={`/invoices/proforma/${ci.proformaInvoice.id}`} className="hover:underline text-sm">
            {ci.proformaInvoice.piNumber}
          </Link>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    { key: "issued", header: "Issued", render: (ci) => new Date(ci.issuedDate).toLocaleDateString() },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      render: (ci) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/invoices/commercial/${ci.id}`}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/invoices/commercial/${ci.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <DeleteCIButton id={ci.id} ciNumber={ci.ciNumber} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Commercial Invoices"
        description={`${cis.length} total`}
        action={
          <Button asChild size="sm">
            <Link href="/invoices/commercial/new">
              <Plus className="mr-1 h-4 w-4" /> New CI
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={cis} emptyMessage="No commercial invoices yet." />
    </div>
  )
}
