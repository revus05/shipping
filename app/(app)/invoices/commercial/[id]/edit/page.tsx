import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { CIForm } from "@/components/invoices/ci-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function EditCIPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [ci, orders, proformaInvoices] = await Promise.all([
    db.commercialInvoice.findUnique({ where: { id } }),
    db.order.findMany({ orderBy: { orderNumber: "asc" }, select: { id: true, orderNumber: true } }),
    db.proformaInvoice.findMany({ orderBy: { piNumber: "asc" }, select: { id: true, piNumber: true } }),
  ])
  if (!ci) notFound()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit Commercial Invoice" description={ci.ciNumber} />
      <div className="rounded-lg border border-border bg-card p-6">
        <CIForm
          defaultValues={{
            ciNumber: ci.ciNumber,
            orderId: ci.orderId,
            piId: ci.piId,
            status: ci.status as "DRAFT" | "ISSUED",
            issuedDate: new Date(ci.issuedDate).toISOString().split("T")[0],
            paymentTerms: ci.paymentTerms ?? "",
            portOfLoading: ci.portOfLoading ?? "",
            portOfDischarge: ci.portOfDischarge ?? "",
            notes: ci.notes ?? "",
          }}
          apiPath={`/api/invoices/commercial/${id}`}
          method="PUT"
          orders={orders}
          proformaInvoices={proformaInvoices}
        />
      </div>
    </div>
  )
}
