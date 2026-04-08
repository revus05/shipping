import { db } from "@/lib/db"
import { PIForm } from "@/components/invoices/pi-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function NewPIPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams
  const orders = await db.order.findMany({
    orderBy: { orderNumber: "asc" },
    select: { id: true, orderNumber: true },
  })

  const today = new Date().toISOString().split("T")[0]
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  return (
    <div className="max-w-2xl">
      <PageHeader title="New Proforma Invoice" description="Create a proforma invoice for an order." />
      <div className="rounded-lg border border-border bg-card p-6">
        <PIForm
          apiPath="/api/invoices/proforma"
          orders={orders}
          defaultValues={{
            orderId: orderId,
            issuedDate: today,
            validUntil: validUntil,
          }}
        />
      </div>
    </div>
  )
}
