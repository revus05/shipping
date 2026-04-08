import { db } from "@/lib/db"
import { CIForm } from "@/components/invoices/ci-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function NewCIPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams
  const [orders, proformaInvoices] = await Promise.all([
    db.order.findMany({ orderBy: { orderNumber: "asc" }, select: { id: true, orderNumber: true } }),
    db.proformaInvoice.findMany({
      orderBy: { piNumber: "asc" },
      select: { id: true, piNumber: true },
    }),
  ])

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="max-w-2xl">
      <PageHeader title="New Commercial Invoice" description="Issue a commercial invoice for shipment." />
      <div className="rounded-lg border border-border bg-card p-6">
        <CIForm
          apiPath="/api/invoices/commercial"
          orders={orders}
          proformaInvoices={proformaInvoices}
          defaultValues={{ orderId, issuedDate: today }}
        />
      </div>
    </div>
  )
}
