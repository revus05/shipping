import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { PIForm } from "@/components/invoices/pi-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function EditPIPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [pi, orders] = await Promise.all([
    db.proformaInvoice.findUnique({ where: { id } }),
    db.order.findMany({ orderBy: { orderNumber: "asc" }, select: { id: true, orderNumber: true } }),
  ])
  if (!pi) notFound()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit Proforma Invoice" description={pi.piNumber} />
      <div className="rounded-lg border border-border bg-card p-6">
        <PIForm
          defaultValues={{
            piNumber: pi.piNumber,
            orderId: pi.orderId,
            status: pi.status as "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED",
            issuedDate: new Date(pi.issuedDate).toISOString().split("T")[0],
            validUntil: new Date(pi.validUntil).toISOString().split("T")[0],
            notes: pi.notes ?? "",
          }}
          apiPath={`/api/invoices/proforma/${id}`}
          method="PUT"
          orders={orders}
        />
      </div>
    </div>
  )
}
